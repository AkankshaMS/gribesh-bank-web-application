import React, { Fragment } from 'react';
import Hero from './Hero';
import HomeContent from './HomeContent';

export default function Lander() {
  return (
    <Fragment>
      <Hero />
      <div className="box cta">
        <p className="has-text-centered">
          <span className="tag is-primary">HOME PAGE</span>
          This is home page (landing page 1).
        </p>
      </div>
      <HomeContent />
    </Fragment>
  )
}
