import React, { Suspense } from "react";
import Head from 'next/head';
import dynamic from "next/dynamic";
const DynamicMain = dynamic(() => import('../src/main'), {
  ssr: false,
  loading: () => <>Loading...</>
})

export default function IndexPage() {
  return <DynamicMain />;
}
