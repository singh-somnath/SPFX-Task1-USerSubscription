import * as React from 'react';
import {Label} from '@fluentui/react';
import { Controller } from 'react-hook-form';
import {useId}  from '@fluentui/react-hooks';

import { ModernTaxonomyPicker} from "@pnp/spfx-controls-react/lib";
import { WebPartContext } from '@microsoft/sp-webpart-base';

import styles from './ManagedMetadata.module.scss';


interface IManagedMetadataType {
    control : any;
    name : string;
    label : string;   
    ariaInvalid : boolean;
    isRequired : boolean;  
    isMultiSelect : boolean;
    termsetNameOrID  :string;
    panelTitle : string;
    currentContext:WebPartContext;
}
const ManagedMetadata = (props:IManagedMetadataType): JSX.Element  =>{
    const {
        control,
        name,
        label,
        ariaInvalid,
        isRequired,
        termsetNameOrID,
        panelTitle,
        isMultiSelect,
        currentContext      
    }=props;
 

    const id = useId();

    return(
        <div className={styles.managedMetadata}>
            {label && <Label htmlFor={id}>{label}</Label>}            
            <Controller 
                control={control}
                name={name}
                rules={{required:isRequired}}
                render = {({field : {onChange,value}})=>{
               
                    return  <ModernTaxonomyPicker 
                            allowMultipleSelections={isMultiSelect}
                            label=""
                            termSetId={termsetNameOrID}
                            panelTitle={panelTitle}               
                            context={currentContext as any}
                            onChange={onChange}
                            initialValues={value || []}
                            allowSelectingChildren={false}/>
                }}
            />
            {ariaInvalid && <div className={styles.managedMetadataError}>{String(name)} is required.</div>}
        </div>

    )

} 

export default ManagedMetadata;