import React from 'react'
import Header from './Header'
import AnnouncementBar from './Announcement_Bar'
import HeroSection from './Collections'
import FlashSale from './Flash_Sale'
import Premium_Spice_Collection from './Premium_Spice_Collection'
import Smart_Appliances from './Smart_Appliances'
import Story from './Story'
import Spicy_Story from './Spicy_Story'
import WhyChooseUs from './WhyChooseUs'
import RegisterOnApp from '@/components/ui/RegisterOnApp'
import Reviews from '@/components/ui/Reviews'
import Footer from '@/components/ui/Footer'

const Home = () => {
  return (
    <div>
        <Header/>
        <AnnouncementBar/>
        <HeroSection/>
        <FlashSale/>
        <Premium_Spice_Collection/>
        <Smart_Appliances/>
        <Story/>
        <Spicy_Story/>
        <WhyChooseUs/>
        <RegisterOnApp/>
        <Reviews/>
        <Footer/>
    </div>
  )
}

export default Home