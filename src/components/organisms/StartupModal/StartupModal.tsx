import * as React from 'react';
import styled from 'styled-components';
import {Button, Modal} from 'antd';
import {useAppDispatch, useAppSelector} from '@redux/hooks';
import {updateStartupModalVisible} from '@redux/reducers/appConfig';
import MonokleStartupBackground from '@assets/MonokleStartupBackground.svg';

import Colors from '@styles/Colors';

const StyledModal = styled(Modal)`
  .ant-modal-close-icon {
    font-size: 14px !important;
    color: ${Colors.grey700};
  }
  .ant-modal-header {
    background-color: ${Colors.grey1000};
  }
  .ant-modal-body {
    background-color: ${Colors.grey1000};
  }
  .ant-modal-footer {
    padding-top: 20px;
    border-top: none;
    background-color: ${Colors.grey1000};
  }

  .ant-modal-content {
    overflow: hidden;
  }

  h1 {
    color: ${Colors.whitePure};
    font-size: 56px;
  }

  p {
    color: ${Colors.whitePure};
    font-size: 20px;
  }

  li {
    color: ${Colors.whitePure};
    font-size: 20px;
  }
`;

const StyledBackgroundImg = styled.img`
  height: 100%;
  width: 100%;
  opacity: 0.1;
`;

const StyledGradientDiv = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  width: 100%;
  height: 110%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(196, 196, 196, 0) 100%);
`;

const StyledContentContainerDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const StyledContentDiv = styled.div`
  padding: 72px 64px;
`;

const HeightFillDiv = styled.div`
  display: block;
  height: 400px;
`;

const StartupModal = () => {
  const dispatch = useAppDispatch();

  const startupModalVisible = useAppSelector(state => state.config.startupModalVisible);

  const handleClose = () => {
    dispatch(updateStartupModalVisible(false));
  };

  return (
    <StyledModal
      visible={startupModalVisible}
      centered
      width={800}
      onCancel={handleClose}
      footer={
        <Button style={{zIndex: 100}} type="primary" onClick={handleClose}>
          Get Started!
        </Button>
      }
    >
      <HeightFillDiv />
      <StyledGradientDiv>
        <StyledBackgroundImg src={MonokleStartupBackground} />
      </StyledGradientDiv>
      <StyledContentContainerDiv>
        <StyledContentDiv>
          <h1>Welcome 🎉</h1>
          <p>Monokle is your K8s best friend that helps you:</p>
          <ul>
            <li>Read your manifests</li>
            <li>Understand links and relationships</li>
            <li>Debug Kustomizations and Helm charts</li>
            <li>Diff and apply changes to your clusters</li>
            <li>And many more!</li>
          </ul>
        </StyledContentDiv>
      </StyledContentContainerDiv>
    </StyledModal>
  );
};

export default StartupModal;
