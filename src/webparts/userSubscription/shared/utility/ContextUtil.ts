import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPFI, spfi,SPFx as spSPFx } from "@pnp/sp";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http'; 

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import  "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";

export const spInstanceUtil = (_context : WebPartContext):SPFI =>{
    let _sp:SPFI;
    if (_context) {
          _sp = spfi().using(spSPFx(_context));
          return _sp;
    }else{
        console.log("Context is not valid");
    }
   
};

export async function getItemUsingRenderListDataAsStream(itemId: number, context: WebPartContext): Promise<any> {
        const options: ISPHttpClientOptions = {
            headers: {'odata-version':'3.0'},
            body: `{'query': {
                '__metadata': {'type': 'SP.CamlQuery'},
                'ViewXml': '<View><Query><Where><Eq><FieldRef Name="ID" /><Value Type="Counter">${itemId}</Value></Eq></Where></Query></View>'
            }}`
        };
        //'<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Number'>${itemId}</Value></Eq></Where></Query><ViewFields><FieldRef Name='Country' /></ViewFields></View>'
    
    const endpoint = context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('UserSubscription')/GetItems?$select=Id,Title,Frequency,Country`;

    // Prepare the request body
    try{
            const request = await context.spHttpClient.post(endpoint,SPHttpClient.configurations.v1,options);
            const result = await request.json();
            console.log("Caml : " , result);
            return result;
    }catch(error){
        console.log("Error ",error);
    }                                  
}