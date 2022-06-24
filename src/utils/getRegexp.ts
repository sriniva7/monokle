import {FileEntry} from '@models/fileentry';

export type MatchParamProps = {
  matchCase: boolean;
  matchWholeWord: boolean;
  regExp: boolean;
};

/* based on matching params we change the way we find matches in file */
export function getRegexp(query: string, params: MatchParamProps): RegExp {
  let matchParams = 'gi'; // global, case insensitive by default
  if (params.matchCase) {
    // @param matchCase: respect the casing if true
    matchParams = 'g';
  }
  if (!params.regExp) {
    query = query.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  let queryRegExp = new RegExp(query, matchParams);

  if (params.matchWholeWord) {
    // @param matchWholeWord: find a match only if it is a standalone word, not a substring
    queryRegExp = new RegExp(`\\b${query}\\b`, matchParams);
  }
  if (params.regExp) {
    // if the query is a regular expression
    queryRegExp = new RegExp(query, matchParams);
  }

  return queryRegExp;
}

type Props = {
  textWithHighlights: string;
  indexStart: number;
  indexEnd: number;
};

function decorateMatch(text: string, query: string, fromIndex = 0): Props {
  const textToSearch = text.slice(fromIndex);

  const queryIdx = textToSearch.slice(0).indexOf(query);
  const textWithHighlights = `${textToSearch.slice(0, queryIdx)}<em>${textToSearch.slice(
    queryIdx,
    queryIdx + query.length
  )}</em>${textToSearch.slice(queryIdx + query.length)}`;

  return {textWithHighlights, indexStart: fromIndex + queryIdx, indexEnd: fromIndex + queryIdx + query.length};
}

function getMatchLines(text: string, queryRegExp: RegExp, searchCounterRef: any) {
  const lineArr = text.split('\n');

  const fileLineData = lineArr
    .map((line: string, index: number) => {
      const matchesInLine = line.match(queryRegExp);
      if (!matchesInLine) return null;

      return matchesInLine?.reduce((acc: any, currQuery, matchIdx) => {
        const {textWithHighlights, indexStart, indexEnd} = decorateMatch(
          line,
          currQuery,
          (acc.length && acc[acc.length - 1].end) || 0
        );
        searchCounterRef.current.totalMatchCount += matchIdx + 1;
        return [
          ...acc,
          {
            textWithHighlights,
            lineNumber: index + 1,
            start: indexStart + 1,
            end: indexEnd + 1,
            currentMatchNumber: searchCounterRef.current.totalMatchCount,
          },
        ];
      }, []);
    })
    .filter(el => el);

  return fileLineData;
}

export const filterFilesByQuery = (node: FileEntry, queryRegExp: RegExp, searchCounterRef: any) => {
  if (node.text && node.isSupported && !node.isExcluded) {
    const matches = node.text.match(queryRegExp);
    const matchCount = matches?.length;
    if (matchCount) {
      const matchLines = getMatchLines(node.text, queryRegExp, searchCounterRef);

      searchCounterRef.current = {
        ...searchCounterRef.current,
        filesCount: searchCounterRef.current.filesCount + 1,
      };

      return {
        ...node,
        matches,
        matchCount,
        matchLines,
      };
    }
    return null as unknown as FileEntry;
  }

  return null as unknown as FileEntry;
};
