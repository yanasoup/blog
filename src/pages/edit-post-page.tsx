import React, { useState, useEffect } from 'react';
import EditBlogPostForm, {
  BlogPostApiData,
  BlogPostFormData,
} from '@/test/edit-blog-post-form';
import { useMatch } from 'react-router';
import EditingNavigation from '@/components/partials/editing-navigation';
import { getPostById } from '@/hooks/useGetPost';

const EditBlogPostPage: React.FC = () => {
  const match = useMatch('/edit-post-new/:postId');
  const id = match?.params.postId;
  const [initialData, setInitialData] = useState<BlogPostApiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const params: UseGetPostParams = {
  //   qkey: 'post',
  //   postId: match?.params.postId,
  // };
  // const { post } = useGetPost(params);

  // Simulasi fetch data dari API
  useEffect(() => {
    if (id) {
      console.log('useEffect page');
      setIsLoading(true);
      setError(null);

      const response = getPostById(id);
      response.then((post) => {
        const initData: BlogPostApiData = {
          title: post?.title || '',
          content: post?.content || '',
          tags: post?.tags || [],
          imageUrl: post?.imageUrl || '',
        };
        setInitialData(initData);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Submitting data:', data);

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', JSON.stringify(data.tags)); // Kirim tags sebagai string JSON

      if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage); // Upload file baru
      } else if (typeof data.coverImage === 'string') {
        formData.append('coverImageUrl', data.coverImage); // Kirim URL yang sudah ada
      }

      /*(const response = await fetch(`/api/blog-posts/${data.id}`, {
        method: 'PUT',
        body: formData,
        // Jangan set 'Content-Type': 'multipart/form-data', browser akan mengaturnya secara otomatis
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog post');
      }

      const result = await response.json();
      console.log('Blog post updated successfully:', result);*/

      alert('Blog post updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !initialData)
    return <div className='p-6 text-center'>Loading blog post...</div>;
  if (error)
    return <div className='p-6 text-center text-red-600'>Error: {error}</div>;
  if (!initialData)
    return <div className='p-6 text-center'>No blog post found.</div>;

  return (
    <>
      <EditingNavigation title='Edit Post' />
      <div className='custom-container flex min-h-screen py-12 lg:max-w-[848px]'>
        <EditBlogPostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </>
  );
};

export default EditBlogPostPage;
