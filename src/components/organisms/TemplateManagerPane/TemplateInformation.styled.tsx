import {Button} from 'antd';

import {DeleteOutlined as RawDeleteOutlined, FormOutlined as RawFormOutlined} from '@ant-design/icons';

import styled from 'styled-components';

import Colors from '@styles/Colors';

export const Container = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr 40px;
  position: relative;
  margin-bottom: 16px;
`;

export const IconContainer = styled.div`
  height: 50px;
  width: 50px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Name = styled.span<{$width: number}>`
  ${props => `width: ${props.$width}`}
  font-weight: 300;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Description = styled.span<{$width: number}>`
  ${props => `width: ${props.$width}`}
  font-weight: 300;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Footer = styled.span`
  display: flex;
  justify-content: space-between;
`;

export const Author = styled.span`
  color: ${Colors.grey500};
`;

export const Version = styled.span`
  font-style: italic;
`;

export const DeleteOutlined = styled(RawDeleteOutlined)`
  position: absolute;
  top: 5px;
  right: 0px;
  color: ${Colors.red7};
  cursor: pointer;
`;

export const FormOutlined = styled(RawFormOutlined)`
  font-size: 30px;
  padding-top: 4px;
`;

export const OpenButton = styled(Button)`
  margin-top: 8px;
  width: 100px;
`;