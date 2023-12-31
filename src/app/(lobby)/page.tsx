/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Fragment, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
/* Image Import starts */
// ! // TODO: This because it throws error in github actions tsc!!
// @ts-ignore
import Accessories from "@/assets/backpack-one.webp"
// @ts-ignore
import Clothing from "@/assets/clothing-one.webp"
// @ts-ignore
import More from "@/assets/extra.webp"
// @ts-ignore
import Shoes from "@/assets/shoe-one.webp"
/* Image Import ends */

import { desc } from "drizzle-orm"
import { Balancer } from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/ui/aspect-ratio"
import { buttonVariants } from "@/ui/button"
import {
  FeaturedProductsLoading,
  FeaturedStoresLoading,
} from "@/components/custom/home-loader"
import { ProductCard } from "@/components/product/product-card"
import { Scrollable } from "@/components/scrollable"
import { Shell } from "@/components/shells/shell"
import { StoreCard } from "@/components/store-card"
import { Await } from "@/components/util/await-component"

function HeroSection() {
  return (
    <Fragment>
      <div
        aria-labelledby="hero-image"
        className="absolute inset-x-0 top-0 -z-10 w-full md:min-h-screen"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-background/30" />
        <Image
          fill
          priority
          src={"https://source.unsplash.com/xeWan2FAboU"}
          alt="Hero_Image"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <section
        aria-labelledby="hero-section"
        className="relative grid place-items-center md:min-h-[calc(var(--navbar-page-offset)_-_2rem)]"
      >
        <div className="grid w-full max-w-4xl place-items-center gap-6 py-5">
          <h1
            className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[6rem]"
            style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
          >
            {siteConfig.name}, One-stop Solution For All Your Needs
          </h1>
          <p
            className="w-full max-w-xl animate-fade-up text-center text-muted-foreground opacity-0 md:text-xl"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Buy and sell products from independent brands and stores around
              the world
            </Balancer>
          </p>
          <div
            className="flex animate-fade-up gap-4 opacity-0"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            <Link className={cn(buttonVariants(), "px-8")} href="/products">
              Buy Now
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "px-8")}
              href="/dashboard/stores"
            >
              Sell Now
            </Link>
          </div>
        </div>
        <Scrollable className="absolute bottom-6" />
      </section>
    </Fragment>
  )
}

function CategoriesSection() {
  const primeCategories = [
    {
      title: "Clothing",
      link: "clothing",
      src: Clothing,
    },
    {
      title: "Shoes",
      link: "shoes",
      src: Shoes,
    },
    {
      title: "Accessories",
      link: "accessories",
      src: Accessories,
    },
    {
      title: "See More...",
      link: "",
      src: More,
    },
  ]

  return (
    <section
      aria-labelledby="categories-banner"
      className="grid place-items-center space-y-4"
    >
      <h1 className="text-4xl font-bold md:text-5xl">Categories</h1>
      <p className="text-center text-muted-foreground md:text-lg">
        <Balancer>
          Explore out categories and find best products for you
        </Balancer>
      </p>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {primeCategories.map(({ title, link, src }) => (
          <Link
            aria-label={`Go to ${title}`}
            href={`/categories/${link}`}
            key={title}
          >
            <div className="group relative overflow-hidden rounded-md">
              <AspectRatio ratio={4 / 5}>
                <div className="absolute inset-0 z-10 bg-black/60 transition-colors group-hover:bg-black/70" />
                <Image
                  fill
                  priority
                  src={src}
                  placeholder="blur"
                  alt={title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </AspectRatio>
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <h3 className="text-3xl font-medium capitalize text-slate-100 md:text-2xl">
                  {title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// TODO: We could cache and revalidate to reduce accessing db
async function getProducts() {
  return await db.query.products.findMany({
    limit: 8,
    orderBy: desc(products.categoryId), //for different category products
  })
}

async function getStores() {
  return await db.query.stores.findMany({ limit: 4 })
  // TODO: Change query in future to show stores which has products
}

export default function LobbyPage() {
  return (
    <Shell as="div" className="gap-12">
      <HeroSection />
      <CategoriesSection />
      <section
        aria-labelledby="create-a-store-banner-heading"
        className="grid place-items-center gap-6 rounded-lg border bg-card px-6 py-16 text-center text-card-foreground shadow-sm"
      >
        <h2 className="text-2xl font-medium sm:text-3xl">
          Do you want to sell your products on our website?
        </h2>
        <Link href="/dashboard/stores" className={cn(buttonVariants())}>
          Create a store
          <span className="sr-only">Create a store</span>
        </Link>
      </section>
      <section
        aria-labelledby="featured-products-heading"
        className="space-y-6"
      >
        <div className="flex items-center">
          <h2 className="flex-1 text-2xl font-medium sm:text-3xl">
            Featured products
          </h2>
          <Link
            aria-label="Products"
            href="/products"
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            View all
            <span className="sr-only">View all products</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Suspense fallback={<FeaturedProductsLoading />}>
            <Await promise={getProducts()}>
              {(products) => (
                <Fragment>
                  {products.map((product) => (
                    <ProductCard
                      enableAction
                      key={product.id}
                      product={product}
                    />
                  ))}
                </Fragment>
              )}
            </Await>
          </Suspense>
        </div>
      </section>
      <section aria-labelledby="featured-stores-heading" className="space-y-6">
        <div className="flex items-center">
          <h2 className="flex-1 text-2xl font-medium sm:text-3xl">
            Featured stores
          </h2>
          <Link
            aria-label="Stores"
            href="/stores"
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            View all
            <span className="sr-only">View all stores</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense fallback={<FeaturedStoresLoading />}>
            <Await promise={getStores()}>
              {(stores) => (
                <Fragment>
                  {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </Fragment>
              )}
            </Await>
          </Suspense>
        </div>
      </section>
    </Shell>
  )
}
