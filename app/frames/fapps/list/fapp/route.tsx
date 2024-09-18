/* eslint-disable react/jsx-key */
import { DappRegistered } from "../../../../../scripts/on-chain/fetchFromSubgraph";
import { fetchGraphQLRegisteredDapps } from "../../../../../scripts/on-chain/fetchFromSubgraph";
import { frames } from "../../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
    const appname = ctx.searchParams.fapp || '';
    let dapp: DappRegistered | undefined;
    const baseUrl = '/fapps/list/fapp/rate';
    const dappResult = await fetchGraphQLRegisteredDapps();
    console.log("App Name:" + appname);

    if (dappResult && dappResult.data) {
        dapp = dappResult.data.dappRegistereds.find((dapp: { name: string; }) => dapp.name.toLowerCase() === appname?.toLowerCase());
    }

    return {
        image: (
            <div style={{ width: '100%', color: 'white', backgroundColor: '#7e5bc2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px', height: '100%' }}>
                <h1 style={{ color: '#FFD700', marginBottom: '20px', fontSize: 64 }}>{appname}</h1>
                <hr style={{ width: '100%', borderColor: 'white', marginBottom: '10px' }} />
                <h2 style={{ color: 'white', marginBottom: '20px', fontSize: 48 }}>{dapp?.description}</h2>
                <h2 style={{ color: '#ADD8E6', marginRight: '10px', marginTop: 'auto', fontSize: 48 }}>Wanna Rate or Visit the Fapp?</h2>
            </div>
        ),
        buttons: [
            <Button action="post" target={{ pathname: baseUrl, query: { appname: appname, dappId: dapp?.dappId } }}>
               Rate! 
            </Button>,
            <Button action="link" target="https://www.ratecaster.xyz" >
                {'Visit ' + (dapp?.name || '')}
            </Button>,
        ],
    };
});