import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Button = ({ children, onClick }: ButtonProps) => {
  return <ButtonContainer onClick={onClick}>{children}</ButtonContainer>;
};

const ButtonContainer = styled.div`
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
`;

export default Button;
