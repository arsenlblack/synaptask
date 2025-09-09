import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="SynapTask Docs">
      <main className="container" style={{padding:'3rem 0'}}>
        <h1>SynapTask Docs</h1>
        <p>Graph. Flow. Clarity.</p>
        <a className="button button--primary" href="/docs/intro">Open docs →</a>
      </main>
    </Layout>
  );
}
