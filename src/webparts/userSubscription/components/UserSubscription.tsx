import * as React from 'react';
import type { IUserSubscriptionProps } from './IUserSubscriptionProps';
import Button from '../components/button/Button';
import { useEffect, useState } from 'react';
import ModalDialog from '../components/modelDialog/ModalDialog';
import PostForm, { IUserSubscriptionDetail } from './postForm/PostForm';
import Container from './container/Container';
import {  getItemUsingRenderListDataAsStream, spInstanceUtil } from '../shared/utility/ContextUtil';
import { SPFI } from '@pnp/sp';
import "@pnp/graph/taxonomy";


const UserSubscription:React.FC<IUserSubscriptionProps> = (props:IUserSubscriptionProps)=>{
    const[show,setShow] = useState(false); 
    const[post,setPost] = useState<IUserSubscriptionDetail>(undefined);  
    const  spContext:SPFI  =  spInstanceUtil(props.currentContext) ;

    const handleShowModal = (id:number = 0) : void =>{
           console.log("item id ",id);
          
                  try{
                      if(id != 0)
                      {
                        getItemUsingRenderListDataAsStream(id,props.currentContext).then((res)=>{
                          console.log("Result",res);
                          setPost(res.value[0]);
                        }).then(()=>{
                          setShow(!show);
                        });
                      }else{
                         setPost(undefined);
                         setShow(!show);
                      }
                                                
                  }catch(error){                  
                    console.log("Error");                      
                  }  
          
           
    }
//
  
    return (
      <>
          <Button title="> New Click Me" disabled={false} type="button" onClickHandle={()=>handleShowModal()} />        
          <br />
          <br />
          <Button title=">> Update Click Me ID 12" disabled={false} type="button" onClickHandle={()=>handleShowModal(12)} />
          <ModalDialog open={show}>
            <Container headerTitle="Subscription">
              <PostForm closeModalHandle={()=>handleShowModal()} currentContext={props.currentContext} post={post}/>
            </Container>
          </ModalDialog>  
      </>
    );
  
}

export default UserSubscription;
