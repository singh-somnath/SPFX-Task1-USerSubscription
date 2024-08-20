import * as React from 'react';
import {useForm} from "react-hook-form";
import Button from '../button/Button';
import PrimaryDropdown from '../dropdown/PrimaryDropdown';
import ManagedMetadata from '../managedMetadata/ManagedMetadata';
import styles  from './PostForm.module.scss';
import {IComboBoxOption,MessageBar,MessageBarType} from '@fluentui/react';
import { useState,useEffect } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {spInstanceUtil}  from '../../shared/utility/ContextUtil';
import { IItemAddResult } from '@pnp/sp/items/types';
import { ITermInfo } from "@pnp/sp/taxonomy";
import { SPFI } from '@pnp/sp';


export interface IFormValues{
    frequency:string[];
    country: ITermInfo[];
}
export interface IUserSubscriptionDetail{
    Id?:number;
    Frequency:string[];
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
/*
export interface ITermInfo {
    childrenCount: number;
    id: string;
    labels: {
        name: string;
        isDefault: boolean;
        languageTag: string;
    }[];
    createdDateTime: string;
    customSortOrder?: ITermSortOrderInfo[];
    lastModifiedDateTime: string;
    descriptions: {
        description: string;
        languageTag: string;
    }[];
    properties?: ITaxonomyProperty[];
    localProperties?: ITaxonomyLocalProperty[];
    isDeprecated: boolean;
    isAvailableForTagging: {
        setId: string;
        isAvailable: boolean;
    }[];
    topicRequested?: boolean;
    parent?: ITermInfo;
    set?: ITermSetInfo;
    relations?: IRelationInfo[];
    children?: ITermInfo[];
}

*/
const mapToTermInfo = (initialValue):ITermInfo => (
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
    const  spContext:SPFI  =  spInstanceUtil(data.currentContext) ;
    

    const {handleSubmit,control,getValues,reset,formState:{errors,isSubmitting,isSubmitSuccessful} } = useForm<IFormValues>({
        defaultValues:{
            frequency:data.post?.Frequency || undefined,           
            country:data.post?.Country ? [mapToTermInfo(data.post.Country)] : []
        }
    });   

    useEffect(()=>{
        const currentOptions: IComboBoxOption[] = [          
            { key: 'Immediately', text: 'Immediately' },
            { key: 'Daily', text: 'Daily' },
            { key: 'Weekly', text: 'Weekly' },
            { key: 'Monthly', text: 'Monthly' }              
          ];
        
          setOptions(currentOptions);
    },[])

    
   useEffect(()=>{
        if(isSubmitSuccessful)
        { 
          
            reset({
                frequency:undefined,
                country: [] // Reset taxonomy picker field to empty array
            });   
        }
    },[isSubmitSuccessful])
    
    

    const onFormSubmission = (postData:IFormValues):void=>{   
             
        if(!isSubmitSuccessful){
            
                if(data.post && data.post.Id)
                {
                    try{
                       
                        spContext.web.lists.getByTitle("UserSubscription").items.getById(data.post.Id).update({
                            Frequency: postData.frequency, // alloa single user
                            UserId:  data.currentContext.pageContext.legacyPageContext.userId,
                            Country: { 
                                Label:postData.country[0].labels[0].name, 
                                TermGuid: postData.country[0].id, 
                                WssId: '-1'
                            }})
                            .then((res:IItemAddResult)=>{
                                setStatus({
                                    message : "Data Updated successfully.",
                                    status:true,
                                    type : MessageBarType.success
                                });      
                             }).then(()=>{
                                data.closeModalHandle()
                             }).catch((error)=>{
                                console.log(error);
                            })    
                                           
                    }catch(error){                  
                        setStatus({
                            message : "Error in data insert.",
                            status:true,
                            type : MessageBarType.error
                        });                          
                    }         
                }  
                else
                {
                    try{
                        
                        spContext.web.lists.getByTitle("UserSubscription").items.add({
                            Frequency: postData.frequency, // alloa single user
                            UserId:  data.currentContext.pageContext.legacyPageContext.userId,
                            Country: { 
                                Label:postData.country[0].labels[0].name, 
                                TermGuid: postData.country[0].id, 
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
                            }).catch((error)=>{
                                console.log(error);
                            })  
                                           
                    }catch(error){                  
                        setStatus({
                            message : "Error in data insert.",
                            status:true,
                            type : MessageBarType.error
                        });                          
                    }    
                }

            
        }          
    }

    const resetMessageBar = ():void =>{
        setStatus(undefined);       
    };
    
    return(           
            <div>                
                <form onSubmit={handleSubmit(onFormSubmission)}>                  
                    <div className={styles.postFormContainer}>  
                        {status &&    
                            <MessageBar 
                                messageBarType={status.type} 
                                onDismiss={resetMessageBar} 
                                dismissButtonAriaLabel='close' 
                                isMultiline={false} 
                            >{status.message}
                            </MessageBar> 
                        }
                        <div className={styles.postFormContainerMainContainer}>                                
                                  <PrimaryDropdown 
                                    label="Frequency :"
                                    name="frequency"
                                    control={control}
                                    ariaInvalid={errors.frequency ? true : false}
                                    keys={getValues("frequency") ? getValues("frequency") : undefined}
                                    isRequired={true}
                                    optionsList={options ? options : []}
                                    isMultiSelect = {false}
                                  />   
                                  {console.log("Get Value Country",getValues("country"))}
                                  <ManagedMetadata
                                    isMultiSelect={false}
                                    control={control}
                                    label="Country :"
                                    name="country"
                                    ariaInvalid={errors.country ? true : false}                                    
                                    isRequired={true}
                                    termsetNameOrID="a85cfca9-6a0e-4c23-bce4-6a5bb6d7ab02"
                                    panelTitle="Select Term"                                    
                                    currentContext={data.currentContext}                                  
                                  />
                        </div>                    
                        <div className={styles.postFormContainerBottomContainer}>
                            <Button  type="Submit" disabled={isSubmitting} title={data.post ? "Update" : "Submit"} />   
                            <Button  type="button" disabled={false} title={"Cancel"} onClickHandle={data.closeModalHandle}/>   
                        </div>   
                    </div>                              
                </form>
            </div>      
       
    );
}

export default PostForm;