import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button = ({ children, onClick, style, ...props }: ButtonProps) => {
  return (
    <ButtonContainer style={style} onClick={onClick} {...props}>
      {children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button`
  border-radius: 50%;
  border: 1px solid #fff;

  padding: 0;
  width: 30px;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  background: none;

  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`;

export default Button;
