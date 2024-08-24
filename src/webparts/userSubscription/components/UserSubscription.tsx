import * as React from 'react';
import type { IUserSubscriptionProps } from './IUserSubscriptionProps';
import { useState } from 'react';
import ModalDialog from '../components/modelDialog/ModalDialog';
import PostForm, { IUserSubscriptionDetail } from './postForm/PostForm';
import Container from './container/Container';
import {  getSubscribeItemCurrentUser } from '../shared/utility/ContextUtil';
import "@pnp/graph/taxonomy";
import { PrimaryButton } from '@fluentui/react';


const UserSubscription:React.FC<IUserSubscriptionProps> = (props:IUserSubscriptionProps)=>{
    const[show,setShow] = useState(true); 
    const[post,setPost] = useState<IUserSubscriptionDetail>(undefined);  
  

    const handleShowModal = () : void =>{
                
                  try{
                     
                        getSubscribeItemCurrentUser(props.currentContext).then((res)=>{                     
                          setPost(res);
                        }).then(()=>{
                          setShow(!show);
                        }).catch((err)=>{
                           console.log(err);
                        });
                     
                                                
                  }catch(error){                  
                    console.log("Error");                      
                  }  
          
           
    }

    return (
      <>
          <PrimaryButton text="New Click Me" disabled={false} type="button" onClick={()=>handleShowModal()} />        
          <ModalDialog open={show} >
            <Container>
              <PostForm closeModalHandle={()=>handleShowModal()} currentContext={props.currentContext} post={post}/>
            </Container>
          </ModalDialog>  
      </>
    );
  
}

export default UserSubscription;
