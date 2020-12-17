/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  ComponentContainer,
  ComponentType,
  InstanceFactory
} from '@firebase/component';
import { ERROR_FACTORY, ErrorCode } from './util/errors';

import { FirebaseMessaging } from '@firebase/messaging-types-exp';
import { MessagingService } from './messaging-service';
import { _registerComponent } from '@firebase/app-exp';
import { isSupported } from './helpers/isSupported';

export { getToken, deleteToken, onMessage, getMessaging } from './api';

declare module '@firebase/component' {
  interface NameServiceMapping {
    'messaging-exp': FirebaseMessaging;
  }
}

// registerMessaging();
const messagingFactory: InstanceFactory<'messaging-exp'> = (
  container: ComponentContainer
) => {
  if (!isSupported()) {
    throw ERROR_FACTORY.create(ErrorCode.UNSUPPORTED_BROWSER);
  }

  return new MessagingService(
    container.getProvider('app-exp').getImmediate(),
    container.getProvider('installations-exp-internal').getImmediate(),
    container.getProvider('analytics-internal')
  );
};

_registerComponent(
  new Component('messaging-exp', messagingFactory, ComponentType.PUBLIC)
);
