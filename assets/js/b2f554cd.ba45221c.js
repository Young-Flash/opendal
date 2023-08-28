"use strict";(self.webpackChunkopendal_website=self.webpackChunkopendal_website||[]).push([[1477],{10:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"how-opendal-read-data","metadata":{"permalink":"/blog/how-opendal-read-data","editUrl":"https://github.com/apache/incubator-opendal/tree/main/website/blog/2023-08-15-how-opendal-read-data/index.md","source":"@site/blog/2023-08-15-how-opendal-read-data/index.md","title":"OpenDAL Internal: Data Reading","description":"The first article will discuss OpenDAL\'s most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL.","date":"2023-08-15T00:00:00.000Z","formattedDate":"August 15, 2023","tags":[{"label":"internal","permalink":"/blog/tags/internal"}],"readingTime":7.96,"hasTruncateMarker":false,"authors":[{"name":"Xuanwo","url":"https://github.com/Xuanwo","image_url":"https://github.com/Xuanwo.png","imageURL":"https://github.com/Xuanwo.png"}],"frontMatter":{"title":"OpenDAL Internal: Data Reading","date":"2023-08-15T00:00:00.000Z","slug":"how-opendal-read-data","tags":["internal"],"description":"The first article will discuss OpenDAL\'s most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL.","authors":[{"name":"Xuanwo","url":"https://github.com/Xuanwo","image_url":"https://github.com/Xuanwo.png","imageURL":"https://github.com/Xuanwo.png"}]},"nextItem":{"title":"Apache OpenDAL(Incubating): Access Data Freely","permalink":"/blog/opendal-access-data-freely"}},"content":"As the OpenDAL community continues to grow, new abstractions are constantly being added, which has brought some burdens to new contributors participating in development. Many maintainers hope to have a deeper understanding of OpenDAL\'s internal implementation. At the same time, OpenDAL\'s core design has not changed significantly for a long time, making it possible to write a series on internal implementation. I believe now is the time to write a series of articles on OpenDAL\'s internal implementation, to explain from the maintainer\'s perspective how OpenDAL is designed, implemented, and how it can be expanded. With the impending release of OpenDAL v0.40, I hope this series of articles will better help the community understand the past, master the present, and shape the future.\\n\\nThe first article will discuss OpenDAL\'s most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL. Let\'s get started!\\n\\n## Overall Framework\\n\\nBefore starting to introduce the specific OpenDAL interface, let\'s first get familiar with the OpenDAL project.\\n\\n[OpenDAL](https://github.com/apache/incubator-opendal) is an Apache Incubator project aimed at helping users access data from various storage services in a unified, convenient, and efficient way. Its project [vision](https://opendal.apache.org/docs/vision) is \\"free access to data\\":\\n\\n- Free from services: Any service can be accessed freely through native interfaces\\n- Free from implementations: No matter how the underlying implementation is, it can be called in a unified way\\n- Free to integrate: Able to freely integrate with various services and languages\\n- Free to zero cost: Users don\'t have to pay for features they don\'t use\\n\\nOn this philosophical foundation, OpenDAL Rust Core can be mainly divided into the following components:\\n\\n- Operator: The outer interface exposed to users\\n- Layers: Specific implementation of different middleware\\n- Services: Specific implementation of different services\\n\\nFrom a macroscopic perspective, OpenDAL\'s data reading call stack would look like this:\\n\\n![](1.png)\\n\\nAll Layers and Services have implemented a unified Accessor interface, erasing all type information when building the Operator. For the Operator, regardless of what services are used or how many middleware are added, all call logic is consistent. This design splits OpenDAL\'s API into Public API and Raw API, where the Public API is directly exposed to users, providing convenient top-level interfaces, and Raw API is provided to OpenDAL internal developers, maintaining a unified internal interface and providing some convenient implementation.\\n\\n## Operator\\n\\nOpenDAL\'s Operator API will adhere to a consistent calling paradigm as much as possible, reducing users\' learning and usage costs. For example, OpenDAL offers the following APIs for `read`:\\n\\n- `op.read(path)`: Reads the entire content of the specified file\\n- `op.reader(path)`: Creates a Reader for streaming reading\\n- `op.read_with(path).range(1..1024)`: Reads file content using specified parameters, such as range\\n- `op.reader_with(path).range(1..1024)`: Creates a Reader for streaming reading with specified parameters\\n\\nIt\'s not hard to see that `read` is more like syntactic sugar, allowing users to quickly read files without considering various traits like `AsyncRead`. The `reader` provides more flexibility, implementing widely-used community traits like `AsyncSeek`, `AsyncRead`, allowing more flexible data reading. `read_with` and `reader_with` assist users in specifying various parameters in a more natural way through Future Builder functions.\\n\\nThe internal logic of the Operator would look like this:\\n\\n![](2.png)\\n\\nIts main job is to encapsulate the interface for the user:\\n\\n- Completing the construction of `OpRead`: the args for read operation.\\n- Calling the `read` function provided by `Accessor`\\n- Wrapping the returned value as `Reader` and implementing interfaces like `AsyncSeek`, `AsyncRead`, etc., based on `Reader`\\n\\n## Layers\\n\\nA little secret here is that OpenDAL will automatically apply some Layers to the Service to implement some internal logic. As of the completion of this article, OpenDAL\'s automatically added Layers include:\\n\\n- `ErrorContextLayer`: Injects context information, such as `scheme`, `path`, etc., into all returned errors of Operation\\n- `CompleteLayer`: Adds necessary capabilities to services, such as adding seek support to s3\\n- `TypeEraseLayer`: Implements type erasure, uniformly erasing associated types in `Accessor`, so users don\'t need to carry generic parameters when using it\\n\\nHere, `ErrorContextLayer` and `TypeEraseLayer` are relatively simple and won\'t be elaborated on. The focus is on `CompleteLayer`, aimed at adding `seek` or `next` support to OpenDAL\'s returned `Reader` in a zero-cost way, so users don\'t have to re-implement it. OpenDAL initially returned `Reader` and `SeekableReader` through different function calls in early versions, but the actual user feedback was not very good; almost all users were using `SeekableReader`. Therefore, OpenDAL subsequently added seek support as the first priority to the internal `Read` trait during the refactor:\\n\\n```rust\\npub trait Read: Unpin + Send + Sync {\\n    /// Read bytes asynchronously.\\n    fn poll_read(&mut self, cx: &mut Context<\'_>, buf: &mut [u8]) -> Poll<Result<usize>>;\\n\\n    /// Seek asynchronously.\\n    ///\\n    /// Returns `Unsupported` error if underlying reader doesn\'t support seek.\\n    fn poll_seek(&mut self, cx: &mut Context<\'_>, pos: io::SeekFrom) -> Poll<Result<u64>>;\\n\\n    /// Stream [`Bytes`] from underlying reader.\\n    ///\\n    /// Returns `Unsupported` error if underlying reader doesn\'t support stream.\\n    ///\\n    /// This API exists for avoiding bytes copying inside async runtime.\\n    /// Users can poll bytes from underlying reader and decide when to\\n    /// read/consume them.\\n    fn poll_next(&mut self, cx: &mut Context<\'_>) -> Poll<Option<Result<Bytes>>>;\\n}\\n```\\n\\nTo implement a service\'s reading capability in OpenDAL, one needs to implement this trait, which is an internal interface and will not be directly exposed to users. Among them:\\n\\n- `poll_read` is the most basic requirement; all services must implement this interface.\\n- When the service natively supports `seek`, `poll_seek` can be implemented, and OpenDAL will correctly dispatch, such as local fs;\\n- When the service natively supports `next`, meaning it returns streaming Bytes, `poll_next` can be implemented, like HTTP-based services, where the underlying layer is a TCP Stream, and hyper will encapsulate it as a bytes stream.\\n\\nThrough the `Read` trait, OpenDAL ensures that all services can expose their native support capabilities as much as possible, thereby achieving efficient reading for different services.\\n\\nBased on this trait, OpenDAL will complete according to the capabilities supported by each service:\\n\\n- Both seek/next are supported: Direct return\\n- No support for next: Encapsulate using `StreamableReader` to simulate next support\\n- No support for seek: Encapsulate using `ByRangeSeekableReader` to simulate seek support\\n- Neither seek/next supported: Encapsulate using both methods\\n\\n> `ByRangeSeekableReader` mainly utilizes the service\'s ability to support range read, dropping the current reader when the user seeks and initiating a new request at the specified location.\\n\\nOpenDAL exposes a unified Reader implementation through `CompleteLayer`, so users don\'t have to worry about whether the underlying service supports seek; OpenDAL will always choose the optimal way to initiate the request.\\n\\n## Services\\n\\nAfter the completion of the Layers, it\'s time to call the specific implementation of the Service. Here, the most common services `fs` and `s3` are used as examples to explain how data is read.\\n\\n### Service fs\\n\\n`tokio::fs::File` implements `tokio::AsyncRead` and `tokio::AsyncSeek`. Using `async_compat::Compat`, we have transformed it into `futures::AsyncRead` and `futures::AsyncSeek`. Based on this, we provide a built-in function `oio::into_read_from_file` to transform it into a type that implements `oio::Read`.\\n\\nThere\'s nothing particularly complex in the implementation of `oio::into_read_from_file`; read and seek are mostly calling the functions provided by the incoming File type. The tricky part is about the correct handling of seek and range: seeking to the right side of the range is allowed, and this will not cause an error, and reading will only return empty, but seeking to the left side of the range is illegal, and the Reader must return `InvalidInput` for proper upper-level handling.\\n\\n> Interesting history: there was [an issue](https://github.com/apache/incubator-opendal/issues/2717) in the initial implementation of this part, discovered during fuzz testing.\\n\\n### Services s3\\n\\nS3 is an HTTP-based service, and opendal provides a lot of HTTP-based wrappers to help developers reuse logic; they only need to build a request and return a well-constructed Body. OpenDAL Raw API encapsulates a set of reqwest-based interfaces, and the HTTP GET interface returns a `Response<IncomingAsyncBody>`:\\n\\n```rust\\n/// IncomingAsyncBody carries the content returned by remote servers.\\npub struct IncomingAsyncBody {\\n    /// # TODO\\n    ///\\n    /// hyper returns `impl Stream<Item = crate::Result<Bytes>>` but we can\'t\\n    /// write the types in stable. So we will box here.\\n    ///\\n    /// After [TAIT](https://rust-lang.github.io/rfcs/2515-type_alias_impl_trait.html)\\n    /// has been stable, we can change `IncomingAsyncBody` into `IncomingAsyncBody<S>`.\\n    inner: oio::Streamer,\\n    size: Option<u64>,\\n    consumed: u64,\\n    chunk: Option<Bytes>,\\n}\\n```\\n\\nThe stream contained in this body is the bytes stream returned by reqwest, and opendal implements content length checks and read support on this basis.\\n\\nHere\'s an extra note about a small pitfall with reqwest/hyper: reqwest and hyper do not check the returned content length, so an illegal server may return a data volume that does not match the expected content length instead of an error, leading to unexpected data behavior. OpenDAL specifically added checks here, returning `ContentIncomplete` when data is insufficient and `ContentTruncated` when data exceeds expectations, avoiding users receiving illegal data.\\n\\n## Conclusion\\n\\nThis article introduces from top to bottom how OpenDAL implements data reading:\\n\\n- Operator is responsible for exposing user-friendly interfaces\\n- Layers are responsible for completing the capabilities of the services\\n- Services are responsible for the specific implementation of different services\\n\\nThroughout the entire chain, OpenDAL adheres as much as possible to the principle of zero cost, prioritizing the use of native service capabilities, then considering simulation through other methods, and finally returning unsupported errors. Through this three-tier design, users don\'t need to understand the details of the underlying service, nor do they need to integrate different service SDKs to easily call `op.read(path)` to access data in any storage service.\\n\\nThis is: How **OpenDAL** read data freely!"},{"id":"opendal-access-data-freely","metadata":{"permalink":"/blog/opendal-access-data-freely","editUrl":"https://github.com/apache/incubator-opendal/tree/main/website/blog/2023-07-07-apache-opendal-access-data-freely/index.md","source":"@site/blog/2023-07-07-apache-opendal-access-data-freely/index.md","title":"Apache OpenDAL(Incubating): Access Data Freely","description":"If you\'re committed to building cloud-native, cross-cloud-first applications and services, or you want to support configurable storage backends to meet complex data access needs, or if you\'re tired of juggling various SDKs and hoping for a unified abstraction and development experience, Apache OpenDAL (Incubating) will be your perfect partner.","date":"2023-07-07T00:00:00.000Z","formattedDate":"July 7, 2023","tags":[{"label":"announcement","permalink":"/blog/tags/announcement"}],"readingTime":4.59,"hasTruncateMarker":true,"authors":[{"name":"PsiACE","url":"https://github.com/PsiACE","image_url":"https://github.com/PsiACE.png","imageURL":"https://github.com/PsiACE.png"},{"name":"Xuanwo","url":"https://github.com/Xuanwo","image_url":"https://github.com/Xuanwo.png","imageURL":"https://github.com/Xuanwo.png"}],"frontMatter":{"title":"Apache OpenDAL(Incubating): Access Data Freely","date":"2023-07-07T00:00:00.000Z","slug":"opendal-access-data-freely","tags":["announcement"],"description":"If you\'re committed to building cloud-native, cross-cloud-first applications and services, or you want to support configurable storage backends to meet complex data access needs, or if you\'re tired of juggling various SDKs and hoping for a unified abstraction and development experience, Apache OpenDAL (Incubating) will be your perfect partner.","authors":[{"name":"PsiACE","url":"https://github.com/PsiACE","image_url":"https://github.com/PsiACE.png","imageURL":"https://github.com/PsiACE.png"},{"name":"Xuanwo","url":"https://github.com/Xuanwo","image_url":"https://github.com/Xuanwo.png","imageURL":"https://github.com/Xuanwo.png"}]},"prevItem":{"title":"OpenDAL Internal: Data Reading","permalink":"/blog/how-opendal-read-data"},"nextItem":{"title":"Way to Go: OpenDAL successfully entered Apache Incubator","permalink":"/blog/opendal-entered-apache-incubator"}},"content":"If you\'re committed to building cloud-native, cross-cloud-first applications and services, or you want to support configurable storage backends to meet complex data access needs, or if you\'re tired of juggling various SDKs and hoping for a unified abstraction and development experience, Apache OpenDAL (Incubating) will be your perfect partner.\\n\\n![OpenDAL Arch](opendal-arch.png)\\n\\n\x3c!--truncate--\x3e\\n\\n## What is OpenDAL?\\n\\n**OpenDAL** is a data access layer that allows users to easily and efficiently retrieve data from various storage services in a unified way.\\n\\n**Data Access Layer** means: OpenDAL is in a critical position in the data read-write process. We shield the implementation details of different storage backends and provide a set of unified interface abstractions externally.\\n\\nNext, let\'s try to answer *\\"What OpenDAL is not\\"* and deconstruct OpenDAL from another perspective:\\n\\n### Opendal Is Not a Proxy Service\\n\\nOpenDAL is provided in the form of a library, not as a service or application that proxies various storage backends.\\n\\nIf you want to integrate OpenDAL into an existing project, you need to call OpenDAL\'s interface directly through the bindings supported by OpenDAL to access the storage services.\\n\\n### Opendal Is Not an SDK Aggregator\\n\\nAlthough OpenDAL replaces various SDKs in the application architecture, it is not implemented as an SDK aggregator.\\n\\nIn other words, OpenDAL does not simply call various storage service SDKs. We have developed our own docking with various storage services based on a unified Rust core to ensure that the differences between services are smoothed out.\\n\\nFor example, for S3, OpenDAL manually constructs HTTP requests and parses HTTP responses to ensure that all behaviors comply with API specifications and are fully under the control of OpenDAL. Due to OpenDAL\'s native takeover of the data access process, we can easily implement unified retry and logging mechanisms for various storage backends and ensure behavioral consistency.\\n\\nFor compatible services with S3, due to the limitations of native storage services and differences in API implementation, compatibility and behavioral details may differ from S3. For example, OSS needs to set an independent header to ensure consistent behavior for `Range`. In addition to docking with native storage services, OpenDAL will also perform targeted processing for compatible services to ensure users\' data access experience.\\n\\n## Advantages of OpenDAL\\n\\nOpenDAL is not the only project dedicated to providing data access abstraction, but compared to other similar projects, OpenDAL has the following advantages:\\n\\n### Rich Service Support\\n\\nOpenDAL supports dozens of storage services, covering a wide range of scenarios and supporting on-demand selection:\\n\\n- Standard Storage Protocols: FTP, HTTP, SFTP, WebDAV, etc.\\n- Object Storage Services: azblob, gcs, obs, oss, s3, etc.\\n- File Storage Services: fs, azdfs, hdfs, webhdfs, ipfs, etc.\\n- Consumer Cloud Storage Service: Google Drive, OneDrive, Dropbox, etc.\\n- Key-Value Storage Service: Memory, Redis, Rocksdb, etc.\\n- Cache Storage Service: Ghac, Memcached, etc.\\n\\n### Complete Cross-Language Bindings\\n\\nWith Rust as the core, OpenDAL now provides binding support for multiple languages such as Python/Node.js/Java/C and is also actively developing bindings for other languages.\\n\\nCross-language bindings not only provide unified storage access abstractions for other languages but also follow naming conventions and development habits that are common in various languages as much as possible to pave the way for quick use.\\n\\n### Powerful Middleware Support\\n\\nOpenDAL offers native layer support, enabling users to implement middleware or intercept for all operations.\\n\\n- Error Retry: OpenDAL supports fine-grained error retry capabilities. In addition to common request retries, it supports breakpoint resumable transmission without having to re-read the entire file.\\n- Observability: OpenDAL implements logging,tracing,and metrics support for all operations. Turning on middleware can directly obtain observability capabilities for storage.\\n- Concurrency control, flow control, fuzz testing, and more.\\n\\n### Easy to Use\\n\\nOpenDAL\'s API has been well designed and polished in actual use. The documentation covers everything and is easy to get started with. Here\'s an example of using Python bindings to access HDFS:\\n\\n```python\\nimport opendal\\n    \\nop = opendal.Operator(\\"hdfs\\", name_node=\\"hdfs://192.16.8.10.103\\")\\nop.read(\\"path/to/file\\")\\n```\\n\\n### Use Cases of OpenDAL\\n\\nCurrently, OpenDAL is widely used in various scenarios that require cloud-native capabilities, including but not limited to databases, data pipelines, and caches. The main user cases include:\\n\\n- [Databend](https://github.com/datafuselabs/databend/): A modern Elasticity and Performance cloud data warehouse. Using OpenDAL to read and write persistent data (s3, azblob, gcs, hdfs, etc.) and cache data (fs, redis, rocksdb, moka, etc.).\\n- [GreptimeDB](https://github.com/GreptimeTeam/greptimedb): An open-source, cloud-native, distributed time-series database. Using OpenDAL to read and write persistent data (s3, azblob, etc.).\\n- [mozilla/sccache](https://github.com/mozilla/sccache/): `sccache` is [`ccache`](https://github.com/ccache/ccache) with cloud storage. Using OpenDAL to read and write cache data (s3 and ghac, etc.).\\n- [RisingWave](https://github.com/risingwavelabs/risingwave): A Distributed SQL Database for Stream Processing. Using OpenDAL to read and write persistent data (s3, azblob, hdfs, etc.).\\n- [Vector](https://github.com/vectordotdev/vector): A high-performance observability data pipeline. Using OpenDAL to write persistent data (currently mainly using hdfs).\\n\\n## Future Plans of OpenDAL\\n\\nIn addition to further meeting the needs of cloud-native data access, OpenDAL will continue to expand user scenarios and actively explore its use in data science and mobile applications. At the same time, OpenDAL will continue to polish its existing implementations and bindings to provide users with a better integration experience.\\n\\nOpenDAL will also explore how to improve users\' workflows in data management and service integration:\\n\\n- Polish the `oli` command-line tool to help users manage data painlessly.\\n- Implement the `oay` proxy service to provide users with high-quality compatible APIs.\\n\\nIn addition, since OpenDAL is currently a cross-language project, we also plan to write a series of introductory tutorials to help everyone learn OpenDAL from scratch while learning the language."},{"id":"opendal-entered-apache-incubator","metadata":{"permalink":"/blog/opendal-entered-apache-incubator","editUrl":"https://github.com/apache/incubator-opendal/tree/main/website/blog/2023-03-16-opendal-entered-apache-incubator/index.md","source":"@site/blog/2023-03-16-opendal-entered-apache-incubator/index.md","title":"Way to Go: OpenDAL successfully entered Apache Incubator","description":"On February 27th, 2023, the OpenDAL project achieved a milestone by winning the approval to join the incubator of the Apache Software Foundation (ASF), the world\'s leading open source software organization. On March 15th, the OpenDAL project was officially transferred to the Apache Software Foundation.","date":"2023-03-16T00:00:00.000Z","formattedDate":"March 16, 2023","tags":[{"label":"announcement","permalink":"/blog/tags/announcement"}],"readingTime":4.73,"hasTruncateMarker":true,"authors":[{"name":"PsiACE","url":"https://github.com/PsiACE","image_url":"https://github.com/PsiACE.png","imageURL":"https://github.com/PsiACE.png"}],"frontMatter":{"title":"Way to Go: OpenDAL successfully entered Apache Incubator","date":"2023-03-16T00:00:00.000Z","slug":"opendal-entered-apache-incubator","tags":["announcement"],"description":"On February 27th, 2023, the OpenDAL project achieved a milestone by winning the approval to join the incubator of the Apache Software Foundation (ASF), the world\'s leading open source software organization. On March 15th, the OpenDAL project was officially transferred to the Apache Software Foundation.","authors":[{"name":"PsiACE","url":"https://github.com/PsiACE","image_url":"https://github.com/PsiACE.png","imageURL":"https://github.com/PsiACE.png"}]},"prevItem":{"title":"Apache OpenDAL(Incubating): Access Data Freely","permalink":"/blog/opendal-access-data-freely"}},"content":"![OpenDAL successfully entered Apache Incubator](opendal-entered-apache.png)\\n\\nOn February 27th, 2023, the [OpenDAL](https://github.com/apache/incubator-opendal) project achieved a milestone by winning the approval to join the incubator of the [Apache Software Foundation](https://www.apache.org/) (ASF), the world\'s leading open source software organization. On March 15th, the OpenDAL project was officially transferred to the Apache Software Foundation.\\n\\n\x3c!--truncate--\x3e\\n\\nThis is a significant moment for [Databend](https://github.com/datafuselabs/databend), as it means that OpenDAL\'s technology and vision have received wider recognition and support from the open source community.\\n\\n> The Apache Incubator was established in October 2002 to provide a path for projects and codebases that aspire to become part of the Apache Software Foundation. Incubating projects need to follow ASF\'s governance and operational practices, and use ASF\'s infrastructure and resources. Incubating projects need to go through a series of stages and evaluations before they can graduate to become top-level projects (TLPs) of ASF.\\n\\n![Apache OpenDAL Project Incubation Status - Apache Incubator](incubator-project-opendal.png)\\n\\n_<https://incubator.apache.org/projects/opendal.html>_\\n\\n## What is OpenDAL?\\n\\nData is one of the most important assets in the future, and data access is the key for realizing data value.\\n\\nThere are various kinds of storage services in the market, each with its own unique interfaces and features, which bring a lot of complexity and inconvenience to data access.\\n\\nOpenDAL provides a unified, simple, efficient, reliable, and observable data access layer that allows developers to seamlessly use different storage services and enjoy the best user experience.\\n\\n![M*N to M+N with OpenDAL](opendal-power.png)\\n\\nOpenDAL simplifies the process of interfacing different storage services, and provides features such as automatic retry, request optimization, and observability. With OpenDAL, developers can directly access a bunch of storage services, without having to understand and master the details of specific SDKs.\\n\\nOpenDAL\'s features include but are not limited to:\\n\\n- Support for dozens of storage services, including local file system, HDFS, S3, OSS, etc.\\n- Provide a unified data access interface, without worrying about the underlying storage details.\\n- Support for various common data operations, including `read`, `write`, `list`, etc.\\n- Support for automatic retry, request optimization, and observability mechanisms.\\n- Zero cost, directly mapped to API calls.\\n- Cross-language bindings: Python, Node.js, C (being worked on), etc.\\n\\n## The Story about OpenDAL\\n\\n### Born for Universal Data Access\\n\\nOpenDAL originated from the vision of creating a universal, unified and user-friendly data access layer. It came into being in late 2021, initially as a component of the Databend project.\\n\\n- On December 21, 2021, [Xuanwo](http://github.com/Xuanwo) embarked on the design and re-implementation of Databend\'s storage access layer, [dal2: Add basic operations of `read`, `write`, `stat`, `delete`](https://github.com/datafuselabs/databend/pull/3575).\\n- On December 27, 2021, the [proposal: Vision of Databend DAL](https://github.com/datafuselabs/databend/discussions/3662) was put forward and discussed. On December 29th, dal2\'s implementation was integrated into Databend.\\n- On February 14th 2022 , dal2 officially separated from Databend\'s code repository and became a standalone top-level project. It was formally renamed OpenDAL.\\n\\n### From One to Multiple\\n\\nThanks to Xuanwo, [ClSlaid](https://github.com/ClSlaid) and many other contributors, OpenDAL quickly became a data access layer that supports mainstream storage services such as AWS S3 / Azure Blob / GCS / HDFS, and provided cross-cloud native storage and access support for Databend\'s `COPY INTO`, Stage, Storage.\\n\\n[GreptimeDB](https://github.com/GreptimeTeam/greptimedb) was the first large-scale Rust database project to actively use OpenDAL after Databend. Later, with Xuanwo\'s efforts, [sccache](https://github.com/mozilla/sccache) under Mozilla also tried to use OpenDAL to take over the storage layer. In order to provide more comprehensive support, OpenDAL soon added support for GitHub Action Cache.\\n\\nThen, [RisingWave](https://github.com/risingwavelabs/risingwave) and [Vector](https://github.com/vectordotdev/vector) were supported as well. The number of OpenDAL users started to grow. More and more users choose OpenDAL as their storage access layer.\\n\\n### Sky\'s the Limit\\n\\nOpenDAL has established a small community and formed a product matrix. In addition to the [Rust - opendal](https://crates.io/crates/opendal), it also provides [Python - opendal](https://pypi.org/project/opendal/) and [Nodejs - opendal](https://www.npmjs.com/package/opendal) bindings.\\n\\nOpenDAL has released 99 versions since its open source, with 700+ Github stars, 349K downloads, and 48 developers. The project has been actively updated. We sincerely thank every contributor for their efforts and dedication.\\n\\nBeing a part of Apache incubator is an important milestone in OpenDAL\'s development history. We hope to leverage ASF\'s platform and resources to let OpenDAL focus on providing a neutral, vendor-free, painless, and efficient storage access layer, and better serve the developers.\\n\\nWe expect OpenDAL to be widely used in the following application scenarios:\\n\\n- Data analysis: OpenDAL can help data analysts quickly read or write data from different storage services, and perform various format conversions and operations.\\n- Data science: OpenDAL can help data scientists easily get or save data from different storage services, and perform various preprocessing and postprocessing.\\n- Data engineering: OpenDAL can help data engineers efficiently build and manage data pipelines between different storage services, and perform various monitoring and tuning.\\n\\n## Acknowledgements\\n\\n**_From Xuanwo_**\\n\\nHello everyone, I\'m Xuanwo, the Committer of Apache OpenDAL (Incubating).\\n\\nThe OpenDAL project embodies my personal dream. Now it has entered the Apache incubator with the collaboration of the community. I feel very happy at this moment. Thank you all contributors for your contributions, thank Databend Labs for your support, thank Champion tison for your guidance, thank Mentors ningjiang, wusheng, tedliu and hexiaoqiao for your advice.\\n\\nLet us follow the guidance of Apache Way to build a community together and create value for users by providing free, painless and efficient data access experience!\\n\\n## Join OpenDAL Community\\n\\nWe welcome developers and users who are interested in participating in OpenDAL project to join OpenDAL community and follow OpenDAL\'s latest news. You can get more information through the following ways:\\n\\n- Visit OpenDAL official website: <https://opendal.apache.org>\\n- Explore OpenDAL GitHub repository: <https://github.com/apache/incubator-opendal>\\n- Join OpenDAL Discord channel: <https://discord.gg/XQy8yGR2dg>\\n- Subscribe to OpenDAL mailing list: <dev@opendal.apache.org>"}]}')}}]);