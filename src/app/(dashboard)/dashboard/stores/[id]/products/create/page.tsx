import { db } from "@/lib/db"
import type { Category } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AddCategoryForm,
  AddProductForm,
  AddSubCategoryForm,
} from "@/components/forms/add-product-form"

interface NewProductPageProps {
  params: {
    id: string
  }
}

export default async function CreateProductPage({
  params,
}: NewProductPageProps) {
  const storeId = Number(params.id)

  const categories = await db.query.categories.findMany()
  // TODO: UKW this shit can be cached

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col-reverse gap-6 lg:flex-row">
        <AddProductForm storeId={storeId} categories={categories} />
        <ExtraButtons categories={categories} />
      </CardContent>
    </Card>
  )
}

interface ExtraButtonProps {
  categories: Category[]
}

function ExtraButtons({ categories }: ExtraButtonProps) {
  return (
    <div className="flex flex-1 gap-4 lg:mt-6 lg:flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="h-auto w-full">
            Add Category/Subcategory
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Tabs defaultValue="category">
            <DialogHeader>
              <TabsList className="mt-4 grid w-full grid-cols-2">
                <TabsTrigger value="category">New Category</TabsTrigger>
                <TabsTrigger value="subcategory">New Subcategory</TabsTrigger>
              </TabsList>
            </DialogHeader>
            <TabsContent value="category">
              <Card className="border-none">
                <CardHeader>
                  <CardTitle>Create cateogry</CardTitle>
                  <CardDescription>
                    Create a new category for your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddCategoryForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subcategory">
              <Card className="border-none">
                <CardHeader>
                  <CardTitle>Create sub-category</CardTitle>
                  <CardDescription>
                    Create a new sub-category for your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddSubCategoryForm categories={categories} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
