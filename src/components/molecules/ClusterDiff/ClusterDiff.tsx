import {Button, Divider} from 'antd';
import React from 'react';
import styled from 'styled-components';

import {useAppDispatch} from '@redux/hooks';
import {loadClusterDiff} from '@redux/thunks/loadClusterDiff';

import {ClusterToLocalResourcesMatch} from '@models/appstate';

import {ResourceFilterIconWithPopover, SectionRenderer} from '@components/molecules';

import {ReloadOutlined} from '@ant-design/icons';

import ClusterDiffSectionBlueprint, {ClusterDiffScopeType} from '@src/navsections/ClusterDiffSectionBlueprint';

import * as S from './ClusterDiff.styled';
import ClusterDiffNamespaceFilter from './ClusterDiffNamespaceFilter';

const Container = styled.div<{height?: number}>`
  display: flex;
  ${props => props.height && `height: ${props.height};`}
`;

const LeftPane = styled.div`
  flex-grow: 1;
`;

const FilterContainer = styled.span`
  margin-left: 10px;
`;

const RefreshButton = styled(Button)`
  margin-top: 1px;
  margin-left: 8px;
`;

const ListContainer = styled.div`
  overflow-y: scroll;
  height: 70vh;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

function ClusterDiff() {
  const dispatch = useAppDispatch();
  const onClickRefresh = () => {
    dispatch(loadClusterDiff());
  };

  return (
    <Container>
      <LeftPane>
        <S.TitleBar>
          <RefreshButton icon={<ReloadOutlined />} onClick={onClickRefresh} size="small" type="primary" ghost>
            Refresh
          </RefreshButton>
          <Divider type="vertical" style={{height: 40, marginLeft: 16}} />
          <S.TitleBarRightButtons>
            <ClusterDiffNamespaceFilter />
            <FilterContainer>
              <ResourceFilterIconWithPopover />
            </FilterContainer>
          </S.TitleBarRightButtons>
        </S.TitleBar>
        <Divider style={{margin: '8px 0'}} />
        <ListContainer>
          <S.List>
            <SectionRenderer<ClusterToLocalResourcesMatch, ClusterDiffScopeType>
              sectionBlueprint={ClusterDiffSectionBlueprint}
              level={0}
              isLastSection={false}
            />
          </S.List>
        </ListContainer>
      </LeftPane>
    </Container>
  );
}

export default ClusterDiff;