import React, { FC } from 'react';
import styles from './Home.module.css';

interface HomeProps {}

const Home: FC<HomeProps> = () => (
  <div className={styles.Home}>
    Home Component
  </div>
);

export default Home;
