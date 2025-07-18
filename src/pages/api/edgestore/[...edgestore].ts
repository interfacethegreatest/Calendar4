import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/pages';

const es = initEdgeStore.create();

/**
 * This is the main router for the edgestore buckets.
 */
const edgeStoreRouter = es.router({
  myPublicImages: es.imageBucket(),

  cvBucket: es
    .fileBucket({
      maxSize: 2 * 1024 * 1024, // 2MB
      accept: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      ],
    })
    .beforeUpload(({ ctx, input, fileInfo }) => {
      console.log('beforeUpload', ctx, input, fileInfo);
      return true; // allow upload
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      console.log('beforeDelete', ctx, fileInfo);
      return true; // allow delete
    }),
});


export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
