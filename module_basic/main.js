/* 방법 1 */
import { hello1, hello2 } from "./hello.js";

hello1();
hello2();

/* 방법 2 */
import * as hello from "./hello.js";

hello.hello1();
hello.hello2();

/* 방법 3 */
import hello3 from "./hello.js";

hello3();
