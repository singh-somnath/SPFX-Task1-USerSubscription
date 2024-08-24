import * as React from 'react';
import styles  from './PostForm.module.scss';
import {ComboBox, DialogFooter, IComboBox, IComboBoxOption,ILabelStyles,Label,MessageBar,MessageBarType, PrimaryButton, Stack} from '@fluentui/react';
import { useState,useEffect } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {spInstanceUtil}  from '../../shared/utility/ContextUtil';
import { IItemAddResult } from '@pnp/sp/items/types';
import { ITermInfo as mapTermInfo } from "@pnp/sp/taxonomy";
import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";
import { SPFI } from '@pnp/sp';
import { ModernTaxonomyPicker } from '@pnp/spfx-controls-react';


export interface IFormValues{
    frequency:string[];
    country: ITermInfo[];
}
export interface IUserSubscriptionDetail{
    Id?:number;
    Frequency:string;
    Country:ITermInfo[] ;
 
}


interface IPostType{
    post ?: IUserSubscriptionDetail;
    closeModalHandle: () => void;
    currentContext:WebPartContext;
}

interface IStatusMessage{
    message :string;
    status  :boolean;
    type : MessageBarType;
}
const labelStyle:ILabelStyles = {
    root:{
        color: 'red',
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'capitalize'
    }
};

const mapToTermInfo = (initialValue):mapTermInfo => (
    {
    id: initialValue.TermGuid,
    labels: [{ 
        name: initialValue.Label,
        languageTag:"en-US",
        isDefault:true
    }],
    childrenCount: 0,
    createdDateTime: new Date().toISOString(),
    descriptions: [],
    isAvailableForTagging: [{
        isAvailable: true,
        setId:"a85cfca9-6a0e-4c23-bce4-6a5bb6d7ab02"
    }],
    isDeprecated: false,
    lastModifiedDateTime: new Date().toISOString(),
}); 
const PostForm = (data?:IPostType): JSX.Element  =>{
    const[status,setStatus] = useState<IStatusMessage>();
    const[options,setOptions] = useState<IComboBoxOption[]>([]);
    const[isSubmitSuccessful,setIsSubmitSuccessful] = useState(false);
    const[isSubmitting,setIsSubmitting] = useState(false);

    const [frequency, setFrequency] = useState<string>(data.post?.Frequency || null);
    const [country, setcountry] = useState<mapTermInfo[]>(data.post?.Country ? [mapToTermInfo(data.post.Country)] : []);

   

    const[frequencyError,setFrequencyError] = useState(false);
    const[countryError,setCountryError] = useState(false);

    const  spContext:SPFI  =  spInstanceUtil(data.currentContext) ; 

    useEffect(()=>{
        console.log(data);
        console.log(frequency, "---",country);
        const currentOptions: IComboBoxOption[] = [          
            { key: 'Immediately', text: 'Immediately' },
            { key: 'Daily', text: 'Daily' },
            { key: 'Weekly', text: 'Weekly' },
            { key: 'Monthly', text: 'Monthly' }              
          ];
        
          setOptions(currentOptions);
    },[])

    
    const onChangeFrequency = ( event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption,
      ):void =>{
        setFrequencyError(false);
        setFrequency(option?.key as string);
    }

    const onTaxPickerChange = (terms ?: ITermInfo[]):void => {
        setCountryError(false);
        setcountry(terms as any);
    }

    

    const onFormSubmission = ():void=>{  
        if(!isSubmitSuccessful){
                setIsSubmitting(true);
                if(frequency.length <= 0){
                    setFrequencyError(true);
                    setIsSubmitting(false);
                    return;
                }

                if(country.length <= 0){
                    setCountryError(true);
                    setIsSubmitting(false);
                    return;
                }   
                {console.log("frequency",frequency)}      
                if(data.post && data.post.Id)
                {
                    try{
                       
                        spContext.web.lists.getByTitle("UserSubscription").items.getById(data.post.Id).update({
                            Frequency: frequency, // alloa single user
                            UserId:  data.currentContext.pageContext.legacyPageContext.userId,
                            Country: { 
                                Label:country[0].labels[0].name, 
                                TermGuid: country[0].id, 
                                WssId: '-1'
                            }})
                            .then((res:IItemAddResult)=>{
                                setStatus({
                                    message : "Data Updated successfully.",
                                    status:true,
                                    type : MessageBarType.success
                                });      
                             }).then(()=>{
                                data.closeModalHandle();
                                setIsSubmitSuccessful(true);
                                setIsSubmitting(false);
                             }).catch((error)=>{
                                console.log(error);
                            })    
                                           
                    }catch(error){                  
                        setStatus({
                            message : "Error in data insert.",
                            status:true,
                            type : MessageBarType.error
                        });    
                        setIsSubmitting(false);                      
                    }         
                }  
                else
                {
                    try{
                        
                        spContext.web.lists.getByTitle("UserSubscription").items.add({
                            Frequency: frequency, // alloa single user
                            UserId:  data.currentContext.pageContext.legacyPageContext.userId,
                            Country: { 
                                Label:country[0].labels[0].name, 
                                TermGuid: country[0].id, 
                                WssId: '-1'
                            }})
                            .then((res:IItemAddResult)=>{
                            setStatus({
                                message : "Data Inserted successfully.",
                                status:true,
                                type : MessageBarType.success
                              });      
                            }).then(()=>{
                                data.closeModalHandle();
                                setIsSubmitSuccessful(true);
                                setIsSubmitting(false);
                            }).catch((error)=>{
                                console.log(error);
                            })  
                                           
                    }catch(error){                  
                        setStatus({
                            message : "Error in data insert.",
                            status:true,
                            type : MessageBarType.error
                        });
                        setIsSubmitting(false);                          
                    }    
                }
               

            
        }          
    }

    const resetMessageBar = ():void =>{
        setStatus(undefined);       
    };
    
    return(          
            <Stack horizontal={false} tokens={{ childrenGap: 5 }} styles={{ root: { width: '100%' } }}>
            {status &&    
                <MessageBar 
                    messageBarType={status.type} 
                    onDismiss={resetMessageBar} 
                    dismissButtonAriaLabel='close' 
                    isMultiline={false} 
                >{status.message}
                </MessageBar> 
            }
            
                    <ComboBox 
                        label='Frequency :'                                  
                        options={options ? options : []}
                        multiSelect = {false}
                        selectedKey={frequency}
                        onChange= {onChangeFrequency} 
                    /> 
                    {frequencyError && <div className={styles.primaryDropdownError}>Frequency is required.</div>}                            
                    <ModernTaxonomyPicker 
                            allowMultipleSelections={false}
                            label="Country :"
                            termSetId="a85cfca9-6a0e-4c23-bce4-6a5bb6d7ab02"
                            panelTitle="Select Term"             
                            context={data.currentContext as any}
                            onChange={onTaxPickerChange}
                            initialValues={country as any || []}
                            allowSelectingChildren={false}
                    />
                    {countryError && <Label styles={labelStyle}>Country is required.</Label>} 
                    
                                
            <DialogFooter>
                <PrimaryButton  type="button"  disabled={isSubmitting} text={data.post ? "Update" : "Submit"} onClick={onFormSubmission}/>   
                <PrimaryButton  type="button" disabled={false} text={"Cancel"} onClick={data.closeModalHandle}/>   
            </DialogFooter>   
           </Stack> 
    );
}

export default PostForm;