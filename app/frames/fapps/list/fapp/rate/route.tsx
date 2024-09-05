/* eslint-disable react/jsx-key */
import { DappRegistered, fetchGraphQLRegisteredDapps } from "../../../../../../scripts/graphQL/fetchFromSubgraph";
import { frames } from "../../../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
    const appname = ctx.searchParams.fapp || '';
    const dappId = ctx.searchParams.dappId || '';

    let dapp: DappRegistered | undefined;
    const baseUrl = '/fapps/list/rate';
    console.log("App Name:" + appname);

    return {
        image: (
            <div style={{ color: 'white', backgroundColor: '#7e5bc2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 48, marginBottom: '20px', flexWrap: 'wrap' }}>
              <h1 style={{ color: 'white', marginRight: '20px' }}>Rate</h1>
              <h1 style={{ color: '#FFD700', marginLeft: '20px' }}>{appname}</h1>
            </div>
              <hr style={{ width: '100%', borderColor: 'white', marginBottom: '20px' }} />
              <h2 style={{ color: '#ADD8E6', marginTop: 'auto', fontSize: 48 }}>Cast Your Vote: 1-5 Stars</h2>
          </div>
        ),
        
        buttons: [
            <Button action="tx" post_url='/' target={{ pathname: baseUrl, query: { appname: appname, dappId: dappId } }}>
                {'Rate ' + (dapp?.name || '')}
            </Button>
        ],
        textInput: "put some text here",
    };
});