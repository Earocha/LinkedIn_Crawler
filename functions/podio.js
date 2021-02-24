import {api as PodioApi} from 'podio-js'
import {Credentials} from './helper'

const podio = new PodioApi ({
    authType:'client',
    clientId: 'syncapp-fnio2n',
    clientSecret: 'pPM8YLw5LVh7Pnmnuy4BZ8ErsWB8Yya1GEu9j2d9n5VhxcxoeWvdqrVgzwKnK7pw'
})

export const getData = () =>  {
    return new Promise((resolve,reject)=>{
        podio.authenticateWithApp(Credentials.PodioAppId,Credentials.PodioAppToken, (err)=>{
            if(err) throw new Error(err);
            podio.authenticateWithApp(Credentials.PodioAppId, Credentials.PodioAppToken, (err) => {
                if (err) throw new Error(err);
                var objectRequest = {
                    limit:500,
                    "sort_desc":true,
                    "offset":4000
                }
                resolve(podio.request('GET', `/item/app/${Credentials.PodioAppId}`,objectRequest, function(response) {
                    console.log('resolved', response);
                }).catch(err => console.log(err)));
            });
        })
    })
}