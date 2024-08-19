import * as React from 'react';
import {Modal} from '@fluentui/react';
import {useId}  from '@fluentui/react-hooks';

interface IModalDialog{
  children: React.ReactNode,
  open:boolean
}

const ModalDialog = (props:IModalDialog): JSX.Element  =>{
    const {
        children,
        open,    
    }=props;
    
    const id = useId();

    return(
        <div>
          <Modal
            titleAriaId={id}
            isOpen={open}
          >
            {children}
          </Modal>
        </div>

    )

} 

export default ModalDialog;