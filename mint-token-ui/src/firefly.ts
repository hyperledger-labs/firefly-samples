// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  FireFlyTokenBalanceResponse,
  FireFlyTokenMintRequest,
} from '@hyperledger/firefly-sdk';
import axios, { AxiosInstance } from 'axios';

export interface FireFlyMessage {
  header: {
    id: string;
    author: string;
    created: string;
  };
  local: boolean;
}

export interface FireFlyMessageEvent {
  type: string;
  message: FireFlyMessage;
}

export interface FireFlyStatus {
  defaults: {
    namespace: string;
  };
  node: {
    registered: boolean;
    name: string;
  };
  org: {
    registered: boolean;
    name: string;
    identity: string;
  };
}

export class FireFly {
  private rest: AxiosInstance;
  private ns = 'default';

  constructor(host: string) {
    this.rest = axios.create({ baseURL: `${host}/api/v1` });
  }

  async sendTokenMint(data: FireFlyTokenMintRequest): Promise<void> {
    await this.rest.post(`/namespaces/${this.ns}/tokens/mint`, data);
  }

  async getBalances(): Promise<FireFlyTokenBalanceResponse[]> {
    const response = await this.rest.get<FireFlyTokenBalanceResponse[]>(
      `/namespaces/${this.ns}/tokens/balances`
    );
    return response.data;
  }

  async getStatus(): Promise<FireFlyStatus> {
    const response = await this.rest.get<FireFlyStatus>(`/status`);
    return response.data;
  }
}
