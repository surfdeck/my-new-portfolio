import Image from 'next/image'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

const blogPosts = [
  {
    title: 'Embracing Vim: The Unsung Hero of Code Editors',
    publishedAt: '2024-04-09',
    summary: 'Discover why Vim, with its steep learning curve, remains a beloved tool among developers for editing code efficiently and effectively.',
    link: '/blog/vim',
    image: '/images/vim.jpg', // Replace with actual image path
    imageWidth: 600,
    imageHeight: 300,
  },
  {
    title: 'The Power of Static Typing in Programming',
    publishedAt: '2024-04-07',
    summary: 'In the ever-evolving landscape of software development, the debate between dynamic and static typing continues to be a hot topic.',
    link: '/blog/static-typing',
    image: '/images/static-typing.jpg', // Replace with actual image path
    imageWidth: 600,
    imageHeight: 300,
  },
  {
    title: 'Spaces vs. Tabs: The Indentation Debate Continues',
    publishedAt: '2024-04-08',
    summary: 'Explore the enduring debate between using spaces and tabs for code indentation, and why this choice matters more than you might think.',
    link: '/blog/spaces-vs-tabs',
    image: '/images/spaces-vs-tabs.jpg', // Replace with actual image path
    imageWidth: 600,
    imageHeight: 300,
  },
]

export default function Page() {
  return (
    <section className="container mx-auto px-6 py-12">
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-center">
        My Blog
      </h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-full h-48 relative">
              <Image 
                src={post.image} 
                alt={post.title} 
                layout="fill" 
                objectFit="cover" 
                priority // Use this if it's important to load the image early
              />
            </div>
            <div className="p-6">
              <h2 className="font-semibold text-xl mb-2 text-gray-800">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{post.publishedAt}</p>
              <p className="text-gray-700 mb-4">{post.summary}</p>
              <a href={post.link} className="text-blue-500 font-medium">Read More</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
