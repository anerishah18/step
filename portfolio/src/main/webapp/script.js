// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomFunFact() {
  const facts =
      ['favorite food: thai', 'favorite color: magenta', 'born on Halloween', 'favorite subject: math', 'favorite season: fall'];

  // Pick a random greeting.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factsContainer = document.getElementById('facts-container');
  factsContainer.innerText = fact;
}


async function getGreeting(){
  const response = await fetch('/data');
  const quote = await response.text();
  document.getElementById('quote-container').innerText = quote;
}