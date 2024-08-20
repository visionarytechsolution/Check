import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Lora&display=swap" rel="stylesheet" />
        <meta name="title" content="Real Vission" />
        <meta
          name="description"
          content="This the platform to create a property video. 2 Easy steps. Put your video url and get the video."
        />
        <meta name="keywords" content="real vission, video convert, property video" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="Johny Kim Martin" />
        <meta property="og:title" content="Real Vision" />
        <meta property="og:description" content="Create your property intro video" />
        <meta property="og:image" content="https://i.ibb.co/Zdj8VGP/login.png" />
        <meta property="og:url" content="https://i.ibb.co/Zdj8VGP/login.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
