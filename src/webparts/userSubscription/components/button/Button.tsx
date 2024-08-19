import * as React from "react";
import {PrimaryButton}  from '@fluentui/react/lib/Button';

interface IButtonType{ 
  type: string; 
  disabled: boolean; 
  title: string;
  onClickHandle?: () => void ; 
}

const Button:React.FC<IButtonType> = (props:IButtonType):JSX.Element =>{
  
  const {
    title,
    disabled,
    onClickHandle,
    type
  } = props;

  return(      
  <PrimaryButton type={type} text={title} onClick={onClickHandle} allowDisabledFocus disabled={disabled} />
  )
}

export default Button;