import * as React from 'react';
import styles from './Container.module.scss';

interface ContainerProps {
    children: React.ReactNode;
    headerTitle?:string;
}

const Container : React.FC<ContainerProps> = (props:ContainerProps) =>{

       return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>{props.headerTitle}</div>
            {props.children}
        </div>
    )
}

export default Container;