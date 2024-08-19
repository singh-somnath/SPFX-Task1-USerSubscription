import * as React from 'react';
import {ComboBox, IComboBoxOption,Label} from '@fluentui/react';
import { Controller } from 'react-hook-form';
import {useId}  from '@fluentui/react-hooks';
import styles from './PrimaryDropdown.module.scss';

interface IComboBoxType {
    control : any;
    name : string;
    label : string;
    optionsList : IComboBoxOption[];
    ariaInvalid : boolean;
    isRequired : boolean;
    keys :  string[];
    isMultiSelect : boolean;
}
const PrimaryDropdown:React.FC<IComboBoxType> = (props:IComboBoxType) =>{
    const {
        control,
        name,
        label,     
        optionsList,
        ariaInvalid,
        isRequired,
      
        isMultiSelect
    }=props;
    let {  keys } = props;    

    const id = useId();

    return(
        <div className={styles.primaryDropdown}>
            {label && <Label htmlFor={id}>{label}</Label>} 
            <Controller 
                control={control}
                name={name}
                rules={{required:isRequired}}
                render = {({field : {onChange}})=>(
                    <ComboBox 
                        className={styles.primaryDropdownComboBox}
                        options={optionsList}
                        multiSelect = {isMultiSelect}
                        selectedKey={keys}
                        onChange= {(_, option:IComboBoxOption) => {                         
                            if(isMultiSelect){
                                if(option.selected){
                                    if(keys)
                                        keys = [...keys,option.key as string];
                                    else
                                        keys = [option.key as string];                                   
                                }
                                else{
                                    keys = keys.filter((key:string) => key !== option.key)
                                }
                                onChange(keys);
                            }
                            else{
                                keys = [option.key as string];  
                                onChange(option.key);
                            }                            
                        }}                       

                     />
                )}
            />
            {ariaInvalid && <div className={styles.primaryDropdownError}>{String(name)} is required.</div>}
        </div>

    )

} 

export default PrimaryDropdown;