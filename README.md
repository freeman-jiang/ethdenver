# SuperX

SuperX provides a simple UI for creating and managing Superfluid streams in sandboxed, isolated environments. The application is hosted on Vercel [here](https://ethdenver-superx.vercel.app/) and the contract is deployed to the Polygon Mumbai test network.

SuperX was built during ETHDenver 2022 and is the winner of the Superfluid x Opolis bounty and Opolis x Superfluid bounty.

## Screenshots
<img width="1512" alt="Screen Shot 2022-02-25 at 11 34 23 PM" src="https://user-images.githubusercontent.com/56516912/155829156-80bef162-dd84-4cff-a59d-1d2106db3a19.png">
<img width="1503" alt="Screen Shot 2022-02-25 at 11 38 18 PM" src="https://user-images.githubusercontent.com/56516912/155829255-55a1d390-c459-48a7-ada1-f62129db567d.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 34 55 PM" src="https://user-images.githubusercontent.com/56516912/155829159-16ba074b-0a12-4c66-a939-757aec8c53d2.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 43 38 PM" src="https://user-images.githubusercontent.com/56516912/155829342-46cd84c5-2196-4351-84e1-2a7cfa1bd646.png">

## Motivation 

[Superfluid](https://www.superfluid.finance/) is a protocol on Ethereum that allows for gasless, recurring crypto payments called streams. The problem is that streams were deliberately designed to continue perpetually. For some applications, this is the intended effect. However, streams won’t stop unless a transaction explicitly tells it to. 

SuperX allowed users to manage and create streams in isolated environments so that streams would simply go insolvent instead of continuing to drain the rest of a wallet unnoticed.

## Notes

You will be unable to deploy the contract unless you have exported your private key in a **.env** file.

To run the application, install the dependencies using `yarn`. Then use `yarn dev` or create an optimized production build using `yarn build` and `yarn start`.

Many features are still under development as this was a hackathon project.
