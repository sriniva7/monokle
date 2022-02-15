import {EventEmitter} from 'events';
import log from 'loglevel';
import micromatch from 'micromatch';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

import {HELM_CHART_ENTRY_FILE} from '@constants/constants';

import {AppConfig} from '@models/appconfig';
import {FileMapType, HelmChartMapType, HelmValuesMapType, ResourceMapType} from '@models/appstate';
import {FileEntry} from '@models/fileentry';
import {HelmChart, HelmValuesFile} from '@models/helm';
import {K8sResource} from '@models/k8sresource';

import {createFileEntry, extractK8sResourcesFromFile, fileIsExcluded, readFiles} from '@redux/services/fileEntry';

import {getFileStats} from '@utils/files';

export const HelmChartEventEmitter = new EventEmitter();

/**
 * Gets the HelmValuesFile for a specific FileEntry
 */

export function getHelmValuesFile(fileEntry: FileEntry, helmValuesMap: HelmValuesMapType) {
  return Object.values(helmValuesMap).find(valuesFile => valuesFile.filePath === fileEntry.filePath);
}

/**
 * Gets the HelmChart for a specific FileEntry
 */

export function getHelmChartFromFileEntry(fileEntry: FileEntry, helmChartMap: HelmChartMapType) {
  return Object.values(helmChartMap).find(chart => chart.filePath === fileEntry.filePath);
}

/**
 * Checks if the specified path is a helm values file
 */

export function isHelmValuesFile(filePath: string) {
  return micromatch.isMatch(path.basename(filePath), '*values*.yaml');
}

/**
 * Checks if the specified files are a Helm Chart folder
 */

export function isHelmChartFolder(files: string[]) {
  return files.indexOf(HELM_CHART_ENTRY_FILE) !== -1;
}

/**
 * check if the k8sResource is supported
 * @param resource
 * @returns @boolean
 */
export function isSupportedHelmResource(resource: K8sResource): boolean {
  const helmVariableRegex = /{{.*}}/g;
  return Boolean(resource.text.match(helmVariableRegex)?.length) === false;
}

/**
 * Adds the values file at the given path to the specified HelmChart
 */

export function addHelmValuesFile(
  fileEntryPath: string,
  helmChart: HelmChart,
  helmValuesMap: HelmValuesMapType,
  fileEntry: FileEntry
) {
  const helmValues: HelmValuesFile = {
    id: uuidv4(),
    filePath: fileEntryPath,
    name: fileEntryPath.substring(path.dirname(helmChart.filePath).length + 1),
    isSelected: false,
    helmChartId: helmChart.id,
  };

  helmValuesMap[helmValues.id] = helmValues;
  helmChart.valueFileIds.push(helmValues.id);
  fileEntry.isSupported = true;
}

/**
 * Processes the specified folder as containing a Helm Chart
 */

export function processHelmChartFolder(
  folder: string,
  rootFolder: string,
  files: string[],
  appConfig: AppConfig,
  resourceMap: ResourceMapType,
  fileMap: FileMapType,
  helmChartMap: HelmChartMapType,
  helmValuesMap: HelmValuesMapType,
  result: string[],
  depth: number
) {
  const helmChart: HelmChart = {
    id: uuidv4(),
    filePath: path.join(folder, HELM_CHART_ENTRY_FILE).substr(rootFolder.length),
    name: folder.substr(folder.lastIndexOf(path.sep) + 1),
    valueFileIds: [],
  };
  HelmChartEventEmitter.emit('create', helmChart);

  files.forEach(file => {
    const filePath = path.join(folder, file);
    const fileEntryPath = filePath.substr(rootFolder.length);
    const fileEntry = createFileEntry(fileEntryPath);

    if (fileIsExcluded(appConfig, fileEntry)) {
      fileEntry.isExcluded = true;
    } else if (getFileStats(filePath)?.isDirectory()) {
      const folderReadsMaxDepth = appConfig.projectConfig?.folderReadsMaxDepth || appConfig.folderReadsMaxDepth;

      if (depth === folderReadsMaxDepth) {
        log.warn(`[readFiles]: Ignored ${filePath} because max depth was reached.`);
      } else {
        fileEntry.children = readFiles(
          filePath,
          appConfig,
          resourceMap,
          fileMap,
          helmChartMap,
          helmValuesMap,
          depth + 1,
          isSupportedHelmResource,
          helmChart
        );
      }
    } else if (isHelmValuesFile(file)) {
      addHelmValuesFile(fileEntryPath, helmChart, helmValuesMap, fileEntry);
    } else if (appConfig.fileIncludes.some(e => micromatch.isMatch(fileEntry.name, e))) {
      try {
        extractK8sResourcesFromFile(filePath, fileMap).forEach(resource => {
          resourceMap[resource.id] = resource;
        });
      } catch (e) {
        log.warn(`Failed to parse yaml in file ${fileEntry.name}; ${e}`);
      }

      fileEntry.isSupported = true;
    }

    fileMap[fileEntry.filePath] = fileEntry;
    result.push(fileEntry.name);
  });

  helmChartMap[helmChart.id] = helmChart;
}
