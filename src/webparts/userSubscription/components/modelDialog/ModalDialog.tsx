import * as React from 'react';
import {Dialog, DialogType} from '@fluentui/react';

interface IModalDialog{
  children: React.ReactNode,
  open:boolean
}

const ModalDialog = (props:IModalDialog): JSX.Element  =>{
    const {
        children,
        open           
    }=props;

    const dialogContentProps = {
      type: DialogType.largeHeader,
      title: 'Subscription',
      subText: 'Please enter subscription details',
    };

    return(
        <div>
          <Dialog
            dialogContentProps={dialogContentProps}
            hidden={open}
            modalProps={{
              isBlocking: true,           
              styles: {
                main: {
                  selectors: {
                    ['@media (min-width: 480px)']: {
                      minWidth: 550
                     
                    }
                  }
                }
              }
            }}
          >
            {children}
          </Dialog>
        </div>

    )

} 

export default ModalDialog;