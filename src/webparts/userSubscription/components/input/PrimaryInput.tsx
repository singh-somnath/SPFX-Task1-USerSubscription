import * as React  from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import styles from './PrimaryInput.module.scss';
import { useId } from '@fluentui/react-hooks';
import { TextField, Label } from '@fluentui/react/lib';

interface IInputType {
    control : Control<FieldValues>;
    name : string;
    label : string;
    ariaInvalid : boolean;
    isRequired : boolean;  
    defaultValue:string;
}
const PrimaryInput = (props:IInputType,ref: React.LegacyRef<HTMLInputElement>): JSX.Element  =>{

    const {           
        isRequired,        
        label,        
        ariaInvalid,      
        name,
        control,
        defaultValue
    } = props

    const inputId = useId();
  
   
    return (
        <div className={styles.inputContainer} >
                {label && <Label  htmlFor={inputId}>{label}</Label>}
                <Controller 
                control={control}
                name={name}
                rules={{required:isRequired}}
                render = {({field:{onChange}})=>(
                    <TextField
                        className={styles.inputContainerInputControl}
                        id={inputId}
                        onChange={onChange} 
                        defaultValue={defaultValue}                 
                
                                        
                    />
                )}
            />
              
                {ariaInvalid && <div className={styles.inputContainerError}>{String(name)} is required.</div>}
        </div>
         
    )
}

export default PrimaryInput;