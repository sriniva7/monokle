import {Input, Skeleton as RawSkeleton} from 'antd';

import styled from 'styled-components';

import {GlobalScrollbarStyle} from '@utils/scrollbar';

import Colors from '@styles/Colors';

export const Container = styled.div`
  height: 100%;
`;

export const NotFoundLabel = styled.span`
  margin-left: 16px;
  color: ${Colors.grey7};
`;

export const SearchInput = styled(Input.Search)`
  & input::placeholder {
    color: ${Colors.grey7};
  }
`;

export const SearchInputContainer = styled.div`
  margin-bottom: 25px;
  padding: 0px 16px;
`;

export const TemplateManagerPaneContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-row-gap: 16px;
`;

export const TemplatesContainer = styled.div<{$height: number}>`
  ${props => `height: ${props.$height}px;`}
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 25px;
  overflow-y: auto;
  padding: 0px 16px 10px 16px;
  ${GlobalScrollbarStyle};
`;

export const Skeleton = styled(RawSkeleton)`
  padding: 8px;
`;
