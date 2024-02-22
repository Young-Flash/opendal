// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

use std::sync::Arc;

use anyhow::Result;
use oay::services::WebdavService;
use oay::Config;
use opendal::services::Fs;
use opendal::services::Gdrive;
use opendal::Operator;
use tracing_subscriber::fmt;
use tracing_subscriber::prelude::*;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::registry()
        .with(fmt::layer().pretty())
        .with(EnvFilter::from_default_env())
        .init();

        std::env::set_var("http_proxy", "http://172.21.144.1:7890");
    std::env::set_var("https_proxy", "http://172.21.144.1:7890");

        let mut cfg: Gdrive = Gdrive::default();
        cfg
            .access_token("ya29.a0AfB_byD-rppbuLS7ctJV75DGuuIjkqEdg-3P9XRvLS7R8LzGPI4eIfLQGbMUCY2XXLSlcC9k-LZW-JE3KLOw_zO6S0RWzizwAoI2cYlNxPh4gmSvOvz0PNKc6-mer4W4G0cpGDrymB5bjesp-EN_lEcfnyt_vBPpc5MSBX2vPbinUpJkvMhSaCgYKAdoSARMSFQHGX2Mi-qjhxUtyXSbnVt4VPnqaBQ0187")
            .root("/tmp");
    
        let op = Operator::new(cfg).unwrap().finish();
        op.write(
            "test-gdrive-wasm",
            "Hello, WASM! We are from OpenDAL at rust side!",
        )
        .await
        .unwrap();
        let bs = op.read("test-gdrive-wasm").await.unwrap();
        println!("{}", String::from_utf8(bs).unwrap());

    Ok(())
}
