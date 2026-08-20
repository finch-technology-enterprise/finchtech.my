import Hero from '@/components/hero';
import Products from '@/components/products';
import Expertise from '@/components/expertise';
import About from '@/components/about';
import Contact from '@/components/contact';

export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Products />
      <Expertise />
      <About />
      <Contact />
    </main>
  );
}
