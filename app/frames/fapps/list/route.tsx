/* eslint-disable react/jsx-key */
import { DappRating, fetchDappRatings, fetchGraphQLRegisteredDapps } from "../../../../scripts/graphQL/fetchFromSubgraph";
import { frames } from "../../frames";
import { Button } from "frames.js/next";

const generateStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} style={{ color: '#FFD700' }}>*</span>
      ))}
      {halfStar && <span style={{ color: '#FFD700' }}>*</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={fullStars + i} style={{ color: 'lightgray' }}>*</span>
      ))}
    </div>
  );
};

type RatingsMap = { [dappId: string]: { averageRating: number, count: number } };

function computeAverageRatings(submittedRatings: DappRating[]): RatingsMap {
    const ratings: RatingsMap = {};

    submittedRatings.forEach(({ dappId, starRating }) => {
      if (ratings[dappId]) {
        ratings[dappId].averageRating += starRating;
        ratings[dappId].count += 1;
      } else {
        ratings[dappId] = { averageRating: starRating, count: 1 };
      }
    });

    // Use Object.entries for even safer iteration
    for (const [dappId, ratingInfo] of Object.entries(ratings)) {
        // Here, TypeScript knows that ratingInfo is not undefined
        ratingInfo.averageRating = ratingInfo.averageRating / ratingInfo.count;
    }

    return ratings;
}

  // Function to shuffle an array
  function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
  // Function to get 3 random elements from an array
function getRandomApps<T>(array: T[], numItems: number): T[] {
    const shuffledArray = shuffleArray(array);
    return shuffledArray.slice(0, numItems);
  }

  export const POST = frames(async (ctx) => {
    const baseUrl = '/fapps/list';
    const buttonValue = ctx.searchParams.option;
    const dappResult = await fetchGraphQLRegisteredDapps();
    let ratingsMap: RatingsMap = {};
    let top3Dapps: any[] = [];
    let header: string = 'Top';

    if (dappResult && dappResult.data) {
        try {
            const ratingsData = await fetchDappRatings();
            if (ratingsData && ratingsData.data) {
                console.log(ratingsData.data.dappRatingSubmitteds);
                ratingsMap = computeAverageRatings(ratingsData.data.dappRatingSubmitteds);
            }
        } catch (ratingsError) {
            console.error("Error fetching ratings:", ratingsError);
        }

        const enrichedDapps = dappResult.data.dappRegistereds.map(dapp => ({
            ...dapp,
            averageRating: ratingsMap[dapp.dappId]?.averageRating ?? 0,
            ratingsCount: ratingsMap[dapp.dappId]?.count ?? 0
        }));

        if (buttonValue === 'random') {
            top3Dapps = getRandomApps(enrichedDapps, 3);
            header = 'Random';
        } else {
            const sortedDapps = enrichedDapps.sort((a, b) => {
                const scoreA = a.averageRating * a.ratingsCount;
                const scoreB = b.averageRating * b.ratingsCount;
                return scoreB - scoreA;
            });
            top3Dapps = sortedDapps.slice(0, 3);
            header = 'Top';
        }

        console.log(top3Dapps);
    };
        return {
            image: (
                <div style={{ color: 'white', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 24, padding: '20px', backgroundColor: '#7e5bc2'}}>
                <div style={{ color: '#FFD700', fontSize: 64, display: 'flex' }}>{header} 3 Farcaster Apps:</div>
                <hr style={{ width: '100%', borderColor: 'white', marginBottom: '10px' }} />
                {top3Dapps.map((dapp, index) => (
                  <div key={dapp.id} style={{ fontSize: 42, display: 'flex', flexDirection: 'row', alignItems: 'center',  borderRadius: '2px', width: '100%', }}>
                    <h3 style={{ color: 'white', marginRight: '10px' }}>
                      {index + 1}.<a style={{ color: '#ADD8E6' }}>&nbsp;{dapp.name}:</a>
                    </h3>
                    <p style={{ color: 'white', marginRight: '10px' }}>{dapp.description}</p>
                    <p style={{ marginRight: '10px', fontSize: '42px', color: '#FFD700'}}>{generateStars(dapp.averageRating)}</p>
                  </div>
                ))}
              </div>
            ),
            buttons: [
                ...top3Dapps.map((dapp) => (
                  <Button action='post' target={{ pathname: '/fapps/list/fapp', query: {fapp: dapp.name} }}>
                    {dapp.name}
                  </Button>
                )),
                <Button action="link" target="https://www.ratecaster.xyz" >
                See All
              </Button>
              ],
        
    }
});
