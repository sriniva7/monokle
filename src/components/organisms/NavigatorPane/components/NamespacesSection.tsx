import React from 'react';
import styled from 'styled-components';
import {Select} from 'antd';

const {Option} = Select;

type NamespacesSectionType = {
  namespace: string;
  namespaces: string[];
  onSelect: (selectedNamespace: string) => void;
};

const StyledDiv = styled.div`
  padding-left: 16px;
  width: 100%;
`;

const SelectContainer = styled.div`
  min-width: 50%;
  display: inline;
  float: right;
`;

const NamespacesSection = (props: NamespacesSectionType) => {
  const {namespace, namespaces, onSelect} = props;

  return (
    <StyledDiv>
      <span>Namespace:</span>
      <SelectContainer>
        <Select
          showSearch
          placeholder="Namespace"
          onChange={onSelect}
          size="small"
          style={{width: '100%'}}
          bordered={false}
          value={namespace}
        >
          {namespaces.map(n => {
            return (
              <Option key={n} value={n}>
                {n}
              </Option>
            );
          })}
        </Select>
      </SelectContainer>
    </StyledDiv>
  );
};

export default NamespacesSection;