import styled from 'styled-components';
import { selectedAnimation } from '../../style';

interface ToggleButtonProps {
  children: React.ReactNode;
  onChange: (checked: boolean) => void;
  defaultValue?: boolean;
  checked: boolean;
  disabled?: boolean;
}

const ToggleButton = ({
  checked = false,
  children,
  defaultValue = false,
  disabled = false,
  onChange,
}: ToggleButtonProps) => {
  return (
    <ToggleButtonContainer
      disabled={disabled}
      toggled={checked}
      onClick={(e) => {
        if (disabled) {
          return;
        }
        onChange(!checked);
      }}
    >
      {children}
    </ToggleButtonContainer>
  );
};

const ToggleButtonContainer = styled.div<{
  disabled: boolean;
  toggled: boolean;
}>`
  animation: ${selectedAnimation} ${({ toggled }) => (toggled ? '3s' : '0s')}
    infinite linear;
  border-radius: 50%;
  border: 1px solid #fff;

  width: 30px;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
  ${({ disabled, theme }) =>
    disabled &&
    `
    background: ${theme.color.grey100};
    border: 1px solid ${theme.color.grey100};
    cursor: not-allowed;
  `}
`;

export default ToggleButton;
