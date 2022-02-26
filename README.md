# SuperX

SuperX provides a simple UI for creating and managing Superfluid streams in sandboxed, isolated environments. The application is hosted on Vercel [here](https://ethdenver-superx.vercel.app/) and the contract is deployed to the Polygon Mumbai test network.

## Screenshots
<img width="1512" alt="Screen Shot 2022-02-25 at 11 34 23 PM" src="https://user-images.githubusercontent.com/56516912/155829156-80bef162-dd84-4cff-a59d-1d2106db3a19.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 34 39 PM" src="https://user-images.githubusercontent.com/56516912/155829157-8cf4dd81-0471-422f-bce9-aba5d3937164.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 34 55 PM" src="https://user-images.githubusercontent.com/56516912/155829159-16ba074b-0a12-4c66-a939-757aec8c53d2.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 35 17 PM" src="https://user-images.githubusercontent.com/56516912/155829160-4c7ac67b-afb1-4a24-9ffb-975a79892d43.png">
<img width="1512" alt="Screen Shot 2022-02-25 at 11 35 39 PM" src="https://user-images.githubusercontent.com/56516912/155829162-3e439514-3688-4937-a1d9-22a13d72a08b.png">

## Motivation 

[Superfluid](https://www.superfluid.finance/) is a protocol on Ethereum that allows for gasless, recurring crypto payments called streams. The problem is that streams were deliberately designed to continue perpetually. For some applications, this is the intended effect. However, streams won’t stop unless a transaction explicitly tells it to. 

SuperX allowed users to manage and create streams in isolated environments so that streams would simply go insolvent instead of continuing to drain the rest of a wallet unnoticed.

This website is hosted at https://ethdenver-j394edtds-freeman-jiang.vercel.app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Notes

You will be unable to deploy the contract unless you have exported your private key in a **.env** file.

To run the application, install the dependencies using `yarn`. Then use `yarn dev` or create an optimized production build using `yarn build` and `yarn start`.

Many features are still under development as this was a hackathon project.
