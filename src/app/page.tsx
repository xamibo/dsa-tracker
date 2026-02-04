"use client";

import { useEffect, useMemo, useState } from "react";

type DsaItem = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solution: string;
  solutionLink: string;
  problemLink?: string;
  youtube: string;
  java: string;
};

const STORAGE_KEY = "dsa-sheet-progress-v1";
const DAILY_KEY_PREFIX = "dsa-sheet-daily-";

const getTodayKey = () =>
  `${DAILY_KEY_PREFIX}${new Date().toISOString().slice(0, 10)}`;

const shuffle = <T,>(list: T[]) => {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getProblemLink = (item: DsaItem) => {
  if (item.problemLink) return item.problemLink;
  if (!item.solutionLink) return undefined;
  return item.solutionLink.replace(/\/solutions\/?$/i, "/");
};

const LINKED_LIST_ITEMS: DsaItem[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Iterative pointer reversal with prev/current.",
    solutionLink: "https://leetcode.com/problems/reverse-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reverse+linked+list+leetcode",
    java: "https://github.com/search?q=reverse+linked+list+leetcode+java&type=code",
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Merge with a dummy head pointer.",
    solutionLink:
      "https://leetcode.com/problems/merge-two-sorted-lists/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+two+sorted+lists+leetcode",
    java: "https://github.com/search?q=merge+two+sorted+lists+leetcode+java&type=code",
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Floyd’s slow/fast pointers detect cycle.",
    solutionLink: "https://leetcode.com/problems/linked-list-cycle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=linked+list+cycle+leetcode",
    java: "https://github.com/search?q=linked+list+cycle+leetcode+java&type=code",
  },
  {
    id: "middle-of-the-linked-list",
    title: "Middle of the Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Use slow/fast pointers; slow ends at middle.",
    solutionLink:
      "https://leetcode.com/problems/middle-of-the-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=middle+of+the+linked+list+leetcode",
    java: "https://github.com/search?q=middle+of+the+linked+list+leetcode+java&type=code",
  },
  {
    id: "remove-duplicates-from-sorted-list",
    title: "Remove Duplicates from Sorted List",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Skip equal neighbors in one pass.",
    solutionLink:
      "https://leetcode.com/problems/remove-duplicates-from-sorted-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+duplicates+from+sorted+list+leetcode",
    java: "https://github.com/search?q=remove+duplicates+from+sorted+list+leetcode+java&type=code",
  },
  {
    id: "intersection-of-two-linked-lists",
    title: "Intersection of Two Linked Lists",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Two-pointer switch heads to align lengths.",
    solutionLink:
      "https://leetcode.com/problems/intersection-of-two-linked-lists/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=intersection+of+two+linked+lists+leetcode",
    java: "https://github.com/search?q=intersection+of+two+linked+lists+leetcode+java&type=code",
  },
  {
    id: "palindrome-linked-list",
    title: "Palindrome Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Find mid, reverse second half, compare.",
    solutionLink:
      "https://leetcode.com/problems/palindrome-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=palindrome+linked+list+leetcode",
    java: "https://github.com/search?q=palindrome+linked+list+leetcode+java&type=code",
  },
  {
    id: "delete-node-in-a-linked-list",
    title: "Delete Node in a Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Copy next node value and bypass it.",
    solutionLink:
      "https://leetcode.com/problems/delete-node-in-a-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=delete+node+in+a+linked+list+leetcode",
    java: "https://github.com/search?q=delete+node+in+a+linked+list+leetcode+java&type=code",
  },
  {
    id: "remove-linked-list-elements",
    title: "Remove Linked List Elements",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Use dummy head, skip target values.",
    solutionLink:
      "https://leetcode.com/problems/remove-linked-list-elements/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+linked+list+elements+leetcode",
    java: "https://github.com/search?q=remove+linked+list+elements+leetcode+java&type=code",
  },
  {
    id: "convert-binary-number-in-linked-list-to-integer",
    title: "Convert Binary Number in a Linked List to Integer",
    topic: "Linked List",
    difficulty: "Easy",
    solution: "Accumulate value: val = val * 2 + node.",
    solutionLink:
      "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=convert+binary+number+in+a+linked+list+to+integer+leetcode",
    java: "https://github.com/search?q=convert+binary+number+in+a+linked+list+to+integer+leetcode+java&type=code",
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Digit-wise addition with carry in new list.",
    solutionLink: "https://leetcode.com/problems/add-two-numbers/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=add+two+numbers+leetcode",
    java: "https://github.com/search?q=add+two+numbers+leetcode+java&type=code",
  },
  {
    id: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Two pointers with gap of n, remove target.",
    solutionLink:
      "https://leetcode.com/problems/remove-nth-node-from-end-of-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+nth+node+from+end+of+list+leetcode",
    java: "https://github.com/search?q=remove+nth+node+from+end+of+list+leetcode+java&type=code",
  },
  {
    id: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Iteratively swap pairs using pointers.",
    solutionLink: "https://leetcode.com/problems/swap-nodes-in-pairs/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=swap+nodes+in+pairs+leetcode",
    java: "https://github.com/search?q=swap+nodes+in+pairs+leetcode+java&type=code",
  },
  {
    id: "rotate-list",
    title: "Rotate List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Make it circular, break at new tail.",
    solutionLink: "https://leetcode.com/problems/rotate-list/solutions/",
    youtube: "https://www.youtube.com/results?search_query=rotate+list+leetcode",
    java: "https://github.com/search?q=rotate+list+leetcode+java&type=code",
  },
  {
    id: "partition-list",
    title: "Partition List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Build two lists (<x and >=x), join.",
    solutionLink: "https://leetcode.com/problems/partition-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=partition+list+leetcode",
    java: "https://github.com/search?q=partition+list+leetcode+java&type=code",
  },
  {
    id: "odd-even-linked-list",
    title: "Odd Even Linked List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Separate odd/even chains, then join.",
    solutionLink:
      "https://leetcode.com/problems/odd-even-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=odd+even+linked+list+leetcode",
    java: "https://github.com/search?q=odd+even+linked+list+leetcode+java&type=code",
  },
  {
    id: "sort-list",
    title: "Sort List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Merge sort on linked list, O(n log n).",
    solutionLink: "https://leetcode.com/problems/sort-list/solutions/",
    youtube: "https://www.youtube.com/results?search_query=sort+list+leetcode",
    java: "https://github.com/search?q=sort+list+leetcode+java&type=code",
  },
  {
    id: "reorder-list",
    title: "Reorder List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Split, reverse second half, weave.",
    solutionLink: "https://leetcode.com/problems/reorder-list/solutions/",
    youtube: "https://www.youtube.com/results?search_query=reorder+list+leetcode",
    java: "https://github.com/search?q=reorder+list+leetcode+java&type=code",
  },
  {
    id: "copy-list-with-random-pointer",
    title: "Copy List with Random Pointer",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Interleave copies, assign random, split.",
    solutionLink:
      "https://leetcode.com/problems/copy-list-with-random-pointer/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=copy+list+with+random+pointer+leetcode",
    java: "https://github.com/search?q=copy+list+with+random+pointer+leetcode+java&type=code",
  },
  {
    id: "remove-duplicates-from-sorted-list-ii",
    title: "Remove Duplicates from Sorted List II",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Skip all duplicates using a dummy head.",
    solutionLink:
      "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+duplicates+from+sorted+list+ii+leetcode",
    java: "https://github.com/search?q=remove+duplicates+from+sorted+list+ii+leetcode+java&type=code",
  },
  {
    id: "linked-list-cycle-ii",
    title: "Linked List Cycle II",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Floyd’s algorithm; reset pointer to head.",
    solutionLink:
      "https://leetcode.com/problems/linked-list-cycle-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=linked+list+cycle+ii+leetcode",
    java: "https://github.com/search?q=linked+list+cycle+ii+leetcode+java&type=code",
  },
  {
    id: "add-two-numbers-ii",
    title: "Add Two Numbers II",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Use stacks to add from tail to head.",
    solutionLink:
      "https://leetcode.com/problems/add-two-numbers-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=add+two+numbers+ii+leetcode",
    java: "https://github.com/search?q=add+two+numbers+ii+leetcode+java&type=code",
  },
  {
    id: "split-linked-list-in-parts",
    title: "Split Linked List in Parts",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Compute sizes, split into k parts.",
    solutionLink:
      "https://leetcode.com/problems/split-linked-list-in-parts/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=split+linked+list+in+parts+leetcode",
    java: "https://github.com/search?q=split+linked+list+in+parts+leetcode+java&type=code",
  },
  {
    id: "delete-the-middle-node-of-a-linked-list",
    title: "Delete the Middle Node of a Linked List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "Slow/fast to find middle, bypass it.",
    solutionLink:
      "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=delete+the+middle+node+of+a+linked+list+leetcode",
    java: "https://github.com/search?q=delete+the+middle+node+of+a+linked+list+leetcode+java&type=code",
  },
  {
    id: "flatten-a-multilevel-doubly-linked-list",
    title: "Flatten a Multilevel Doubly Linked List",
    topic: "Linked List",
    difficulty: "Medium",
    solution: "DFS flatten, reconnect prev/next pointers.",
    solutionLink:
      "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=flatten+a+multilevel+doubly+linked+list+leetcode",
    java: "https://github.com/search?q=flatten+a+multilevel+doubly+linked+list+leetcode+java&type=code",
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Min-heap or divide and conquer merge.",
    solutionLink:
      "https://leetcode.com/problems/merge-k-sorted-lists/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+k+sorted+lists+leetcode",
    java: "https://github.com/search?q=merge+k+sorted+lists+leetcode+java&type=code",
  },
  {
    id: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Reverse k nodes at a time with pointers.",
    solutionLink:
      "https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reverse+nodes+in+k-group+leetcode",
    java: "https://github.com/search?q=reverse+nodes+in+k-group+leetcode+java&type=code",
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Hash map + doubly linked list for O(1).",
    solutionLink: "https://leetcode.com/problems/lru-cache/solutions/",
    youtube: "https://www.youtube.com/results?search_query=lru+cache+leetcode",
    java: "https://github.com/search?q=lru+cache+leetcode+java&type=code",
  },
  {
    id: "lfu-cache",
    title: "LFU Cache",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Freq buckets + linked lists, O(1).",
    solutionLink: "https://leetcode.com/problems/lfu-cache/solutions/",
    youtube: "https://www.youtube.com/results?search_query=lfu+cache+leetcode",
    java: "https://github.com/search?q=lfu+cache+leetcode+java&type=code",
  },
  {
    id: "palindrome-pairs",
    title: "Palindrome Pairs",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Hash map words, check prefix/suffix cases.",
    solutionLink: "https://leetcode.com/problems/palindrome-pairs/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=palindrome+pairs+leetcode",
    java: "https://github.com/search?q=palindrome+pairs+leetcode+java&type=code",
  },
  {
    id: "reverse-linked-list-ii",
    title: "Reverse Linked List II",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Reverse sublist between left and right.",
    solutionLink:
      "https://leetcode.com/problems/reverse-linked-list-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reverse+linked+list+ii+leetcode",
    java: "https://github.com/search?q=reverse+linked+list+ii+leetcode+java&type=code",
  },
  {
    id: "design-skiplist",
    title: "Design Skiplist",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Layered linked lists with random levels.",
    solutionLink: "https://leetcode.com/problems/design-skiplist/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=design+skiplist+leetcode",
    java: "https://github.com/search?q=design+skiplist+leetcode+java&type=code",
  },
  {
    id: "all-oone-data-structure",
    title: "All O(1) Data Structure",
    topic: "Linked List",
    difficulty: "Hard",
    solution: "Hash map + doubly linked list of counts.",
    solutionLink:
      "https://leetcode.com/problems/all-oone-data-structure/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=all+oone+data+structure+leetcode",
    java: "https://github.com/search?q=all+oone+data+structure+leetcode+java&type=code",
  },
];
const DP_ITEMS: DsaItem[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "DP",
    difficulty: "Easy",
    solution: "Fibonacci-style DP, O(1) space.",
    solutionLink: "https://leetcode.com/problems/climbing-stairs/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=climbing+stairs+leetcode",
    java: "https://github.com/search?q=climbing+stairs+leetcode+java&type=code",
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    topic: "DP",
    difficulty: "Easy",
    solution: "Bottom-up DP or memoized recursion.",
    solutionLink: "https://leetcode.com/problems/fibonacci-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=fibonacci+number+leetcode",
    java: "https://github.com/search?q=fibonacci+number+leetcode+java&type=code",
  },
  {
    id: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    topic: "DP",
    difficulty: "Easy",
    solution: "DP over costs; min of two previous.",
    solutionLink:
      "https://leetcode.com/problems/min-cost-climbing-stairs/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=min+cost+climbing+stairs+leetcode",
    java: "https://github.com/search?q=min+cost+climbing+stairs+leetcode+java&type=code",
  },
  {
    id: "house-robber",
    title: "House Robber",
    topic: "DP",
    difficulty: "Easy",
    solution: "Rob or skip; keep two running states.",
    solutionLink: "https://leetcode.com/problems/house-robber/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=house+robber+leetcode",
    java: "https://github.com/search?q=house+robber+leetcode+java&type=code",
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    topic: "DP",
    difficulty: "Easy",
    solution: "Kadane’s algorithm, O(n).",
    solutionLink: "https://leetcode.com/problems/maximum-subarray/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+subarray+leetcode",
    java: "https://github.com/search?q=maximum+subarray+leetcode+java&type=code",
  },
  {
    id: "range-sum-query-immutable",
    title: "Range Sum Query (Immutable)",
    topic: "DP",
    difficulty: "Easy",
    solution: "Prefix sums for O(1) range queries.",
    solutionLink:
      "https://leetcode.com/problems/range-sum-query-immutable/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=range+sum+query+immutable+leetcode",
    java: "https://github.com/search?q=range+sum+query+immutable+leetcode+java&type=code",
  },
  {
    id: "counting-bits",
    title: "Counting Bits",
    topic: "DP",
    difficulty: "Easy",
    solution: "DP: bits[i] = bits[i >> 1] + (i & 1).",
    solutionLink: "https://leetcode.com/problems/counting-bits/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=counting+bits+leetcode",
    java: "https://github.com/search?q=counting+bits+leetcode+java&type=code",
  },
  {
    id: "tribonacci-number",
    title: "Tribonacci Number",
    topic: "DP",
    difficulty: "Easy",
    solution: "DP with rolling window of size 3.",
    solutionLink:
      "https://leetcode.com/problems/n-th-tribonacci-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=tribonacci+number+leetcode",
    java: "https://github.com/search?q=tribonacci+number+leetcode+java&type=code",
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "DP",
    difficulty: "Easy",
    solution: "Track minimum price; update max profit.",
    solutionLink:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=best+time+to+buy+and+sell+stock+leetcode",
    java: "https://github.com/search?q=best+time+to+buy+and+sell+stock+leetcode+java&type=code",
  },
  {
    id: "pascals-triangle",
    title: "Pascal’s Triangle",
    topic: "DP",
    difficulty: "Easy",
    solution: "Build rows using previous row values.",
    solutionLink: "https://leetcode.com/problems/pascals-triangle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=pascals+triangle+leetcode",
    java: "https://github.com/search?q=pascals+triangle+leetcode+java&type=code",
  },
  {
    id: "coin-change",
    title: "Coin Change",
    topic: "DP",
    difficulty: "Medium",
    solution: "Bottom-up DP for min coins.",
    solutionLink: "https://leetcode.com/problems/coin-change/solutions/",
    youtube: "https://www.youtube.com/results?search_query=coin+change+leetcode",
    java: "https://github.com/search?q=coin+change+leetcode+java&type=code",
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    topic: "DP",
    difficulty: "Medium",
    solution: "DP O(n^2) or patience sorting O(n log n).",
    solutionLink:
      "https://leetcode.com/problems/longest-increasing-subsequence/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=longest+increasing+subsequence+leetcode",
    java: "https://github.com/search?q=longest+increasing+subsequence+leetcode+java&type=code",
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    topic: "DP",
    difficulty: "Medium",
    solution: "2D DP over prefixes.",
    solutionLink:
      "https://leetcode.com/problems/longest-common-subsequence/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=longest+common+subsequence+leetcode",
    java: "https://github.com/search?q=longest+common+subsequence+leetcode+java&type=code",
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    topic: "DP",
    difficulty: "Medium",
    solution: "Classic DP on string edits.",
    solutionLink: "https://leetcode.com/problems/edit-distance/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=edit+distance+leetcode",
    java: "https://github.com/search?q=edit+distance+leetcode+java&type=code",
  },
  {
    id: "house-robber-ii",
    title: "House Robber II",
    topic: "DP",
    difficulty: "Medium",
    solution: "Two runs: exclude first or last house.",
    solutionLink: "https://leetcode.com/problems/house-robber-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=house+robber+ii+leetcode",
    java: "https://github.com/search?q=house+robber+ii+leetcode+java&type=code",
  },
  {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    topic: "DP",
    difficulty: "Medium",
    solution: "Subset sum DP to target total/2.",
    solutionLink:
      "https://leetcode.com/problems/partition-equal-subset-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=partition+equal+subset+sum+leetcode",
    java: "https://github.com/search?q=partition+equal+subset+sum+leetcode+java&type=code",
  },
  {
    id: "target-sum",
    title: "Target Sum",
    topic: "DP",
    difficulty: "Medium",
    solution: "Transform to subset sum; DP count ways.",
    solutionLink: "https://leetcode.com/problems/target-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=target+sum+leetcode",
    java: "https://github.com/search?q=target+sum+leetcode+java&type=code",
  },
  {
    id: "word-break",
    title: "Word Break",
    topic: "DP",
    difficulty: "Medium",
    solution: "DP over string positions using dictionary.",
    solutionLink: "https://leetcode.com/problems/word-break/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+break+leetcode",
    java: "https://github.com/search?q=word+break+leetcode+java&type=code",
  },
  {
    id: "decode-ways",
    title: "Decode Ways",
    topic: "DP",
    difficulty: "Medium",
    solution: "DP with one/two-digit transitions.",
    solutionLink: "https://leetcode.com/problems/decode-ways/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=decode+ways+leetcode",
    java: "https://github.com/search?q=decode+ways+leetcode+java&type=code",
  },
  {
    id: "unique-paths",
    title: "Unique Paths",
    topic: "DP",
    difficulty: "Medium",
    solution: "Grid DP counting ways from top-left.",
    solutionLink: "https://leetcode.com/problems/unique-paths/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=unique+paths+leetcode",
    java: "https://github.com/search?q=unique+paths+leetcode+java&type=code",
  },
  {
    id: "unique-paths-ii",
    title: "Unique Paths II",
    topic: "DP",
    difficulty: "Medium",
    solution: "Grid DP with obstacles.",
    solutionLink: "https://leetcode.com/problems/unique-paths-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=unique+paths+ii+leetcode",
    java: "https://github.com/search?q=unique+paths+ii+leetcode+java&type=code",
  },
  {
    id: "minimum-path-sum",
    title: "Minimum Path Sum",
    topic: "DP",
    difficulty: "Medium",
    solution: "DP accumulating min cost to each cell.",
    solutionLink: "https://leetcode.com/problems/minimum-path-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+path+sum+leetcode",
    java: "https://github.com/search?q=minimum+path+sum+leetcode+java&type=code",
  },
  {
    id: "jump-game",
    title: "Jump Game",
    topic: "DP",
    difficulty: "Medium",
    solution: "Greedy reachability; DP interpretation.",
    solutionLink: "https://leetcode.com/problems/jump-game/solutions/",
    youtube: "https://www.youtube.com/results?search_query=jump+game+leetcode",
    java: "https://github.com/search?q=jump+game+leetcode+java&type=code",
  },
  {
    id: "jump-game-ii",
    title: "Jump Game II",
    topic: "DP",
    difficulty: "Medium",
    solution: "Greedy levels or DP min jumps.",
    solutionLink: "https://leetcode.com/problems/jump-game-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=jump+game+ii+leetcode",
    java: "https://github.com/search?q=jump+game+ii+leetcode+java&type=code",
  },
  {
    id: "palindromic-substrings",
    title: "Palindromic Substrings",
    topic: "DP",
    difficulty: "Medium",
    solution: "DP over substrings or expand around center.",
    solutionLink:
      "https://leetcode.com/problems/palindromic-substrings/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=palindromic+substrings+leetcode",
    java: "https://github.com/search?q=palindromic+substrings+leetcode+java&type=code",
  },
  {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP on pattern/text with * and . rules.",
    solutionLink:
      "https://leetcode.com/problems/regular-expression-matching/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=regular+expression+matching+leetcode",
    java: "https://github.com/search?q=regular+expression+matching+leetcode+java&type=code",
  },
  {
    id: "wildcard-matching",
    title: "Wildcard Matching",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP with ? and * transitions.",
    solutionLink: "https://leetcode.com/problems/wildcard-matching/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=wildcard+matching+leetcode",
    java: "https://github.com/search?q=wildcard+matching+leetcode+java&type=code",
  },
  {
    id: "burst-balloons",
    title: "Burst Balloons",
    topic: "DP",
    difficulty: "Hard",
    solution: "Interval DP; choose last balloon to burst.",
    solutionLink: "https://leetcode.com/problems/burst-balloons/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=burst+balloons+leetcode",
    java: "https://github.com/search?q=burst+balloons+leetcode+java&type=code",
  },
  {
    id: "distinct-subsequences",
    title: "Distinct Subsequences",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP counting ways to form target from source.",
    solutionLink:
      "https://leetcode.com/problems/distinct-subsequences/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=distinct+subsequences+leetcode",
    java: "https://github.com/search?q=distinct+subsequences+leetcode+java&type=code",
  },
  {
    id: "dungeon-game",
    title: "Dungeon Game",
    topic: "DP",
    difficulty: "Hard",
    solution: "Reverse DP for minimum health needed.",
    solutionLink: "https://leetcode.com/problems/dungeon-game/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=dungeon+game+leetcode",
    java: "https://github.com/search?q=dungeon+game+leetcode+java&type=code",
  },
  {
    id: "scramble-string",
    title: "Scramble String",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP on substrings with split checks.",
    solutionLink: "https://leetcode.com/problems/scramble-string/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=scramble+string+leetcode",
    java: "https://github.com/search?q=scramble+string+leetcode+java&type=code",
  },
  {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP or stack; track longest valid ending at i.",
    solutionLink:
      "https://leetcode.com/problems/longest-valid-parentheses/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=longest+valid+parentheses+leetcode",
    java: "https://github.com/search?q=longest+valid+parentheses+leetcode+java&type=code",
  },
  {
    id: "cherry-pickup",
    title: "Cherry Pickup",
    topic: "DP",
    difficulty: "Hard",
    solution: "3D DP for two traversals in grid.",
    solutionLink: "https://leetcode.com/problems/cherry-pickup/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=cherry+pickup+leetcode",
    java: "https://github.com/search?q=cherry+pickup+leetcode+java&type=code",
  },
  {
    id: "shortest-common-supersequence",
    title: "Shortest Common Supersequence",
    topic: "DP",
    difficulty: "Hard",
    solution: "DP on LCS to build the shortest supersequence.",
    solutionLink:
      "https://leetcode.com/problems/shortest-common-supersequence/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=shortest+common+supersequence+leetcode",
    java: "https://github.com/search?q=shortest+common+supersequence+leetcode+java&type=code",
  },
];
const TREE_ITEMS: DsaItem[] = [
  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "DFS height of left/right + 1.",
    solutionLink:
      "https://leetcode.com/problems/maximum-depth-of-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+depth+of+binary+tree+leetcode",
    java: "https://github.com/search?q=maximum+depth+of+binary+tree+leetcode+java&type=code",
  },
  {
    id: "same-tree",
    title: "Same Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "DFS both trees; compare node values and structure.",
    solutionLink: "https://leetcode.com/problems/same-tree/solutions/",
    youtube: "https://www.youtube.com/results?search_query=same+tree+leetcode",
    java: "https://github.com/search?q=same+tree+leetcode+java&type=code",
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "Swap left/right at each node.",
    solutionLink: "https://leetcode.com/problems/invert-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=invert+binary+tree+leetcode",
    java: "https://github.com/search?q=invert+binary+tree+leetcode+java&type=code",
  },
  {
    id: "symmetric-tree",
    title: "Symmetric Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "Check mirror symmetry with DFS.",
    solutionLink: "https://leetcode.com/problems/symmetric-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=symmetric+tree+leetcode",
    java: "https://github.com/search?q=symmetric+tree+leetcode+java&type=code",
  },
  {
    id: "path-sum",
    title: "Path Sum",
    topic: "Tree",
    difficulty: "Easy",
    solution: "DFS subtract target sum along the path.",
    solutionLink: "https://leetcode.com/problems/path-sum/solutions/",
    youtube: "https://www.youtube.com/results?search_query=path+sum+leetcode",
    java: "https://github.com/search?q=path+sum+leetcode+java&type=code",
  },
  {
    id: "minimum-depth-of-binary-tree",
    title: "Minimum Depth of Binary Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "BFS for first leaf or DFS with care on nulls.",
    solutionLink:
      "https://leetcode.com/problems/minimum-depth-of-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+depth+of+binary+tree+leetcode",
    java: "https://github.com/search?q=minimum+depth+of+binary+tree+leetcode+java&type=code",
  },
  {
    id: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "Postorder height check with early fail.",
    solutionLink:
      "https://leetcode.com/problems/balanced-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=balanced+binary+tree+leetcode",
    java: "https://github.com/search?q=balanced+binary+tree+leetcode+java&type=code",
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "DFS height; track max left+right.",
    solutionLink:
      "https://leetcode.com/problems/diameter-of-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=diameter+of+binary+tree+leetcode",
    java: "https://github.com/search?q=diameter+of+binary+tree+leetcode+java&type=code",
  },
  {
    id: "merge-two-binary-trees",
    title: "Merge Two Binary Trees",
    topic: "Tree",
    difficulty: "Easy",
    solution: "DFS merge nodes recursively.",
    solutionLink:
      "https://leetcode.com/problems/merge-two-binary-trees/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+two+binary+trees+leetcode",
    java: "https://github.com/search?q=merge+two+binary+trees+leetcode+java&type=code",
  },
  {
    id: "subtree-of-another-tree",
    title: "Subtree of Another Tree",
    topic: "Tree",
    difficulty: "Easy",
    solution: "Traverse main tree and match subtrees.",
    solutionLink:
      "https://leetcode.com/problems/subtree-of-another-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=subtree+of+another+tree+leetcode",
    java: "https://github.com/search?q=subtree+of+another+tree+leetcode+java&type=code",
  },
  {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    topic: "Tree",
    difficulty: "Medium",
    solution: "BFS with queue per level.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-level-order-traversal/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+level+order+traversal+leetcode",
    java: "https://github.com/search?q=binary+tree+level+order+traversal+leetcode+java&type=code",
  },
  {
    id: "binary-tree-zigzag-level-order-traversal",
    title: "Binary Tree Zigzag Level Order Traversal",
    topic: "Tree",
    difficulty: "Medium",
    solution: "BFS and reverse alternate levels.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+zigzag+level+order+traversal+leetcode",
    java: "https://github.com/search?q=binary+tree+zigzag+level+order+traversal+leetcode+java&type=code",
  },
  {
    id: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    topic: "Tree",
    difficulty: "Medium",
    solution: "BFS, take last node at each level.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-right-side-view/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+right+side+view+leetcode",
    java: "https://github.com/search?q=binary+tree+right+side+view+leetcode+java&type=code",
  },
  {
    id: "flatten-binary-tree-to-linked-list",
    title: "Flatten Binary Tree to Linked List",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Reverse preorder; rewire pointers.",
    solutionLink:
      "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=flatten+binary+tree+to+linked+list+leetcode",
    java: "https://github.com/search?q=flatten+binary+tree+to+linked+list+leetcode+java&type=code",
  },
  {
    id: "path-sum-ii",
    title: "Path Sum II",
    topic: "Tree",
    difficulty: "Medium",
    solution: "DFS with path tracking and backtracking.",
    solutionLink: "https://leetcode.com/problems/path-sum-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=path+sum+ii+leetcode",
    java: "https://github.com/search?q=path+sum+ii+leetcode+java&type=code",
  },
  {
    id: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Postorder; compute max gain at each node.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+maximum+path+sum+leetcode",
    java: "https://github.com/search?q=binary+tree+maximum+path+sum+leetcode+java&type=code",
  },
  {
    id: "sum-root-to-leaf-numbers",
    title: "Sum Root to Leaf Numbers",
    topic: "Tree",
    difficulty: "Medium",
    solution: "DFS with running number.",
    solutionLink:
      "https://leetcode.com/problems/sum-root-to-leaf-numbers/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sum+root+to+leaf+numbers+leetcode",
    java: "https://github.com/search?q=sum+root+to+leaf+numbers+leetcode+java&type=code",
  },
  {
    id: "house-robber-iii",
    title: "House Robber III",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Tree DP: rob vs skip per node.",
    solutionLink: "https://leetcode.com/problems/house-robber-iii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=house+robber+iii+leetcode",
    java: "https://github.com/search?q=house+robber+iii+leetcode+java&type=code",
  },
  {
    id: "binary-tree-paths",
    title: "Binary Tree Paths",
    topic: "Tree",
    difficulty: "Medium",
    solution: "DFS accumulate path strings.",
    solutionLink: "https://leetcode.com/problems/binary-tree-paths/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+paths+leetcode",
    java: "https://github.com/search?q=binary+tree+paths+leetcode+java&type=code",
  },
  {
    id: "all-nodes-distance-k-in-binary-tree",
    title: "All Nodes Distance K in Binary Tree",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Parent map + BFS from target.",
    solutionLink:
      "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=all+nodes+distance+k+in+binary+tree+leetcode",
    java: "https://github.com/search?q=all+nodes+distance+k+in+binary+tree+leetcode+java&type=code",
  },
  {
    id: "construct-binary-tree-from-preorder-and-inorder-traversal",
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Use preorder root index with inorder splits.",
    solutionLink:
      "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=construct+binary+tree+from+preorder+and+inorder+traversal+leetcode",
    java: "https://github.com/search?q=construct+binary+tree+from+preorder+and+inorder+traversal+leetcode+java&type=code",
  },
  {
    id: "construct-binary-tree-from-postorder-and-inorder-traversal",
    title: "Construct Binary Tree from Postorder and Inorder Traversal",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Use postorder root index with inorder splits.",
    solutionLink:
      "https://leetcode.com/problems/construct-binary-tree-from-postorder-and-inorder-traversal/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=construct+binary+tree+from+postorder+and+inorder+traversal+leetcode",
    java: "https://github.com/search?q=construct+binary+tree+from+postorder+and+inorder+traversal+leetcode+java&type=code",
  },
  {
    id: "count-complete-tree-nodes",
    title: "Count Complete Tree Nodes",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Binary search on last level + height.",
    solutionLink:
      "https://leetcode.com/problems/count-complete-tree-nodes/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=count+complete+tree+nodes+leetcode",
    java: "https://github.com/search?q=count+complete+tree+nodes+leetcode+java&type=code",
  },
  {
    id: "find-duplicate-subtrees",
    title: "Find Duplicate Subtrees",
    topic: "Tree",
    difficulty: "Medium",
    solution: "Serialize subtrees and count duplicates.",
    solutionLink:
      "https://leetcode.com/problems/find-duplicate-subtrees/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+duplicate+subtrees+leetcode",
    java: "https://github.com/search?q=find+duplicate+subtrees+leetcode+java&type=code",
  },
  {
    id: "add-one-row-to-tree",
    title: "Add One Row to Tree",
    topic: "Tree",
    difficulty: "Medium",
    solution: "BFS/DFS to depth-1 then insert nodes.",
    solutionLink: "https://leetcode.com/problems/add-one-row-to-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=add+one+row+to+tree+leetcode",
    java: "https://github.com/search?q=add+one+row+to+tree+leetcode+java&type=code",
  },
  {
    id: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    topic: "Tree",
    difficulty: "Hard",
    solution: "DFS/BFS encode with null markers.",
    solutionLink:
      "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=serialize+and+deserialize+binary+tree+leetcode",
    java: "https://github.com/search?q=serialize+and+deserialize+binary+tree+leetcode+java&type=code",
  },
  {
    id: "binary-tree-cameras",
    title: "Binary Tree Cameras",
    topic: "Tree",
    difficulty: "Hard",
    solution: "Greedy DP states on postorder.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-cameras/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+cameras+leetcode",
    java: "https://github.com/search?q=binary+tree+cameras+leetcode+java&type=code",
  },
  {
    id: "vertical-order-traversal-of-a-binary-tree",
    title: "Vertical Order Traversal of a Binary Tree",
    topic: "Tree",
    difficulty: "Hard",
    solution: "DFS with column/row sorting.",
    solutionLink:
      "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=vertical+order+traversal+of+a+binary+tree+leetcode",
    java: "https://github.com/search?q=vertical+order+traversal+of+a+binary+tree+leetcode+java&type=code",
  },
  {
    id: "maximum-sum-bst-in-binary-tree",
    title: "Maximum Sum BST in Binary Tree",
    topic: "Tree",
    difficulty: "Hard",
    solution: "Postorder DP with BST validity and sums.",
    solutionLink:
      "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+sum+bst+in+binary+tree+leetcode",
    java: "https://github.com/search?q=maximum+sum+bst+in+binary+tree+leetcode+java&type=code",
  },
  {
    id: "recover-binary-tree-from-preorder-traversal",
    title: "Recover Binary Tree from Preorder Traversal",
    topic: "Tree",
    difficulty: "Hard",
    solution: "Parse depth markers, rebuild with stack.",
    solutionLink:
      "https://leetcode.com/problems/recover-a-tree-from-preorder-traversal/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=recover+binary+tree+from+preorder+traversal+leetcode",
    java: "https://github.com/search?q=recover+binary+tree+from+preorder+traversal+leetcode+java&type=code",
  },
  {
    id: "binary-tree-coloring-game",
    title: "Binary Tree Coloring Game",
    topic: "Tree",
    difficulty: "Hard",
    solution: "Count left/right subtree sizes to decide move.",
    solutionLink:
      "https://leetcode.com/problems/binary-tree-coloring-game/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+tree+coloring+game+leetcode",
    java: "https://github.com/search?q=binary+tree+coloring+game+leetcode+java&type=code",
  },
  {
    id: "height-of-binary-tree-after-subtree-removal-queries",
    title: "Height of Binary Tree After Subtree Removal Queries",
    topic: "Tree",
    difficulty: "Hard",
    solution: "Precompute heights and reroot-like answers.",
    solutionLink:
      "https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=height+of+binary+tree+after+subtree+removal+queries+leetcode",
    java: "https://github.com/search?q=height+of+binary+tree+after+subtree+removal+queries+leetcode+java&type=code",
  },
  {
    id: "smallest-subtree-with-all-the-deepest-nodes",
    title: "Smallest Subtree with all the Deepest Nodes",
    topic: "Tree",
    difficulty: "Hard",
    solution: "DFS return depth and candidate node.",
    solutionLink:
      "https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=smallest+subtree+with+all+the+deepest+nodes+leetcode",
    java: "https://github.com/search?q=smallest+subtree+with+all+the+deepest+nodes+leetcode+java&type=code",
  },
];

const GREEDY_ITEMS: DsaItem[] = [
  {
    id: "assign-cookies",
    title: "Assign Cookies",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sort and greedily match smallest cookie to smallest child.",
    solutionLink: "https://leetcode.com/problems/assign-cookies/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=assign+cookies+leetcode",
    java: "https://github.com/search?q=assign+cookies+leetcode+java&type=code",
  },
  {
    id: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sum all positive price differences.",
    solutionLink:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=best+time+to+buy+and+sell+stock+ii+leetcode",
    java: "https://github.com/search?q=best+time+to+buy+and+sell+stock+ii+leetcode+java&type=code",
  },
  {
    id: "lemonade-change",
    title: "Lemonade Change",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Maintain counts of $5 and $10 to give change.",
    solutionLink: "https://leetcode.com/problems/lemonade-change/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=lemonade+change+leetcode",
    java: "https://github.com/search?q=lemonade+change+leetcode+java&type=code",
  },
  {
    id: "can-place-flowers",
    title: "Can Place Flowers",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Greedily place where neighbors are empty.",
    solutionLink: "https://leetcode.com/problems/can-place-flowers/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=can+place+flowers+leetcode",
    java: "https://github.com/search?q=can+place+flowers+leetcode+java&type=code",
  },
  {
    id: "maximum-subarray-greedy",
    title: "Maximum Subarray",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Kadane’s algorithm; keep max ending here.",
    solutionLink: "https://leetcode.com/problems/maximum-subarray/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+subarray+leetcode",
    java: "https://github.com/search?q=maximum+subarray+leetcode+java&type=code",
  },
  {
    id: "minimum-number-of-moves-to-seat-everyone",
    title: "Minimum Number of Moves to Seat Everyone",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sort seats and students; sum absolute diffs.",
    solutionLink:
      "https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+number+of+moves+to+seat+everyone+leetcode",
    java: "https://github.com/search?q=minimum+number+of+moves+to+seat+everyone+leetcode+java&type=code",
  },
  {
    id: "largest-perimeter-triangle",
    title: "Largest Perimeter Triangle",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sort descending; first valid triplet works.",
    solutionLink:
      "https://leetcode.com/problems/largest-perimeter-triangle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=largest+perimeter+triangle+leetcode",
    java: "https://github.com/search?q=largest+perimeter+triangle+leetcode+java&type=code",
  },
  {
    id: "maximum-units-on-a-truck",
    title: "Maximum Units on a Truck",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sort by units per box descending.",
    solutionLink:
      "https://leetcode.com/problems/maximum-units-on-a-truck/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+units+on+a+truck+leetcode",
    java: "https://github.com/search?q=maximum+units+on+a+truck+leetcode+java&type=code",
  },
  {
    id: "split-a-string-in-balanced-strings",
    title: "Split a String in Balanced Strings",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Count balance; increment result when zero.",
    solutionLink:
      "https://leetcode.com/problems/split-a-string-in-balanced-strings/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=split+a+string+in+balanced+strings+leetcode",
    java: "https://github.com/search?q=split+a+string+in+balanced+strings+leetcode+java&type=code",
  },
  {
    id: "minimum-absolute-difference",
    title: "Minimum Absolute Difference",
    topic: "Greedy",
    difficulty: "Easy",
    solution: "Sort and scan adjacent differences.",
    solutionLink:
      "https://leetcode.com/problems/minimum-absolute-difference/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+absolute+difference+leetcode",
    java: "https://github.com/search?q=minimum+absolute+difference+leetcode+java&type=code",
  },
  {
    id: "jump-game-greedy",
    title: "Jump Game",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Track farthest reachable index.",
    solutionLink: "https://leetcode.com/problems/jump-game/solutions/",
    youtube: "https://www.youtube.com/results?search_query=jump+game+leetcode",
    java: "https://github.com/search?q=jump+game+leetcode+java&type=code",
  },
  {
    id: "jump-game-ii-greedy",
    title: "Jump Game II",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Greedy BFS levels with current range.",
    solutionLink: "https://leetcode.com/problems/jump-game-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=jump+game+ii+leetcode",
    java: "https://github.com/search?q=jump+game+ii+leetcode+java&type=code",
  },
  {
    id: "gas-station",
    title: "Gas Station",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Reset start when tank drops below zero.",
    solutionLink: "https://leetcode.com/problems/gas-station/solutions/",
    youtube: "https://www.youtube.com/results?search_query=gas+station+leetcode",
    java: "https://github.com/search?q=gas+station+leetcode+java&type=code",
  },
  {
    id: "partition-labels",
    title: "Partition Labels",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Track last occurrence; cut when current end met.",
    solutionLink: "https://leetcode.com/problems/partition-labels/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=partition+labels+leetcode",
    java: "https://github.com/search?q=partition+labels+leetcode+java&type=code",
  },
  {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Sort by end; remove overlaps greedily.",
    solutionLink:
      "https://leetcode.com/problems/non-overlapping-intervals/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=non+overlapping+intervals+leetcode",
    java: "https://github.com/search?q=non+overlapping+intervals+leetcode+java&type=code",
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Sort by start; merge when overlapping.",
    solutionLink: "https://leetcode.com/problems/merge-intervals/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+intervals+leetcode",
    java: "https://github.com/search?q=merge+intervals+leetcode+java&type=code",
  },
  {
    id: "insert-interval",
    title: "Insert Interval",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Merge overlaps while inserting new interval.",
    solutionLink: "https://leetcode.com/problems/insert-interval/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=insert+interval+leetcode",
    java: "https://github.com/search?q=insert+interval+leetcode+java&type=code",
  },
  {
    id: "task-scheduler",
    title: "Task Scheduler",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Greedy by most frequent; compute idle slots.",
    solutionLink: "https://leetcode.com/problems/task-scheduler/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=task+scheduler+leetcode",
    java: "https://github.com/search?q=task+scheduler+leetcode+java&type=code",
  },
  {
    id: "reorganize-string",
    title: "Reorganize String",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Greedy with max-heap placement.",
    solutionLink: "https://leetcode.com/problems/reorganize-string/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reorganize+string+leetcode",
    java: "https://github.com/search?q=reorganize+string+leetcode+java&type=code",
  },
  {
    id: "wiggle-subsequence",
    title: "Wiggle Subsequence",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Greedy count direction changes.",
    solutionLink:
      "https://leetcode.com/problems/wiggle-subsequence/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=wiggle+subsequence+leetcode",
    java: "https://github.com/search?q=wiggle+subsequence+leetcode+java&type=code",
  },
  {
    id: "queue-reconstruction-by-height",
    title: "Queue Reconstruction by Height",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Sort by height desc, insert by k.",
    solutionLink:
      "https://leetcode.com/problems/queue-reconstruction-by-height/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=queue+reconstruction+by+height+leetcode",
    java: "https://github.com/search?q=queue+reconstruction+by+height+leetcode+java&type=code",
  },
  {
    id: "candy",
    title: "Candy",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Two-pass greedy with left/right constraints.",
    solutionLink: "https://leetcode.com/problems/candy/solutions/",
    youtube: "https://www.youtube.com/results?search_query=candy+leetcode",
    java: "https://github.com/search?q=candy+leetcode+java&type=code",
  },
  {
    id: "minimum-number-of-arrows-to-burst-balloons",
    title: "Minimum Number of Arrows to Burst Balloons",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Sort by end; shoot arrows greedily.",
    solutionLink:
      "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+number+of+arrows+to+burst+balloons+leetcode",
    java: "https://github.com/search?q=minimum+number+of+arrows+to+burst+balloons+leetcode+java&type=code",
  },
  {
    id: "hand-of-straights",
    title: "Hand of Straights",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Greedy with ordered counts of cards.",
    solutionLink: "https://leetcode.com/problems/hand-of-straights/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=hand+of+straights+leetcode",
    java: "https://github.com/search?q=hand+of+straights+leetcode+java&type=code",
  },
  {
    id: "remove-k-digits",
    title: "Remove K Digits",
    topic: "Greedy",
    difficulty: "Medium",
    solution: "Monotonic stack to remove larger digits first.",
    solutionLink: "https://leetcode.com/problems/remove-k-digits/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+k+digits+leetcode",
    java: "https://github.com/search?q=remove+k+digits+leetcode+java&type=code",
  },
  {
    id: "jump-game-iv",
    title: "Jump Game IV",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Graph/BFS with value jumps; optimize with visited groups.",
    solutionLink: "https://leetcode.com/problems/jump-game-iv/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=jump+game+iv+leetcode",
    java: "https://github.com/search?q=jump+game+iv+leetcode+java&type=code",
  },
  {
    id: "maximum-performance-of-a-team",
    title: "Maximum Performance of a Team",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Sort by efficiency; keep top speeds in heap.",
    solutionLink:
      "https://leetcode.com/problems/maximum-performance-of-a-team/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+performance+of+a+team+leetcode",
    java: "https://github.com/search?q=maximum+performance+of+a+team+leetcode+java&type=code",
  },
  {
    id: "create-maximum-number",
    title: "Create Maximum Number",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Greedy pick + merge with max subsequences.",
    solutionLink:
      "https://leetcode.com/problems/create-maximum-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=create+maximum+number+leetcode",
    java: "https://github.com/search?q=create+maximum+number+leetcode+java&type=code",
  },
  {
    id: "minimum-number-of-refueling-stops",
    title: "Minimum Number of Refueling Stops",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Max-heap of fuels; refuel when needed.",
    solutionLink:
      "https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+number+of+refueling+stops+leetcode",
    java: "https://github.com/search?q=minimum+number+of+refueling+stops+leetcode+java&type=code",
  },
  {
    id: "course-schedule-iii",
    title: "Course Schedule III",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Sort by end; keep durations in max-heap.",
    solutionLink:
      "https://leetcode.com/problems/course-schedule-iii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=course+schedule+iii+leetcode",
    java: "https://github.com/search?q=course+schedule+iii+leetcode+java&type=code",
  },
  {
    id: "ipo",
    title: "IPO",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Select projects by profit with max-heap as capital grows.",
    solutionLink: "https://leetcode.com/problems/ipo/solutions/",
    youtube: "https://www.youtube.com/results?search_query=ipo+leetcode",
    java: "https://github.com/search?q=ipo+leetcode+java&type=code",
  },
  {
    id: "candy-distribution-ii",
    title: "Candy Distribution II (advanced variant)",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Greedy distribution with ordering constraints.",
    solutionLink:
      "https://leetcode.com/problems/candy/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=candy+distribution+advanced+variant",
    java: "https://github.com/search?q=candy+distribution+ii+leetcode+java&type=code",
  },
  {
    id: "patching-array",
    title: "Patching Array",
    topic: "Greedy",
    difficulty: "Hard",
    solution: "Greedy extend coverage with minimal patches.",
    solutionLink: "https://leetcode.com/problems/patching-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=patching+array+leetcode",
    java: "https://github.com/search?q=patching+array+leetcode+java&type=code",
  },
];

const GRAPH_ITEMS: DsaItem[] = [
  {
    id: "find-if-path-exists-in-graph",
    title: "Find if Path Exists in Graph",
    topic: "Graph",
    difficulty: "Easy",
    solution: "DFS/BFS to test reachability.",
    solutionLink:
      "https://leetcode.com/problems/find-if-path-exists-in-graph/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+if+path+exists+in+graph+leetcode",
    java: "https://github.com/search?q=find+if+path+exists+in+graph+leetcode+java&type=code",
  },
  {
    id: "find-the-town-judge",
    title: "Find the Town Judge",
    topic: "Graph",
    difficulty: "Easy",
    solution: "Count indegree/outdegree; judge has indegree n-1.",
    solutionLink: "https://leetcode.com/problems/find-the-town-judge/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+the+town+judge+leetcode",
    java: "https://github.com/search?q=find+the+town+judge+leetcode+java&type=code",
  },
  {
    id: "number-of-provinces",
    title: "Number of Provinces",
    topic: "Graph",
    difficulty: "Easy",
    solution: "Count connected components with DFS/BFS.",
    solutionLink: "https://leetcode.com/problems/number-of-provinces/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=number+of+provinces+leetcode",
    java: "https://github.com/search?q=number+of+provinces+leetcode+java&type=code",
  },
  {
    id: "flood-fill",
    title: "Flood Fill",
    topic: "Graph",
    difficulty: "Easy",
    solution: "BFS/DFS repaint connected pixels.",
    solutionLink: "https://leetcode.com/problems/flood-fill/solutions/",
    youtube: "https://www.youtube.com/results?search_query=flood+fill+leetcode",
    java: "https://github.com/search?q=flood+fill+leetcode+java&type=code",
  },
  {
    id: "find-center-of-star-graph",
    title: "Find Center of Star Graph",
    topic: "Graph",
    difficulty: "Easy",
    solution: "Center is common node in first two edges.",
    solutionLink:
      "https://leetcode.com/problems/find-center-of-star-graph/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+center+of+star+graph+leetcode",
    java: "https://github.com/search?q=find+center+of+star+graph+leetcode+java&type=code",
  },
  {
    id: "valid-path",
    title: "Valid Path in Undirected Graph",
    topic: "Graph",
    difficulty: "Easy",
    solution: "Union-Find or BFS from source.",
    solutionLink: "https://leetcode.com/problems/find-if-path-exists-in-graph/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=valid+path+in+undirected+graph+leetcode",
    java: "https://github.com/search?q=valid+path+in+undirected+graph+leetcode+java&type=code",
  },
  {
    id: "keys-and-rooms",
    title: "Keys and Rooms",
    topic: "Graph",
    difficulty: "Easy",
    solution: "DFS/BFS from room 0; check visited count.",
    solutionLink: "https://leetcode.com/problems/keys-and-rooms/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=keys+and+rooms+leetcode",
    java: "https://github.com/search?q=keys+and+rooms+leetcode+java&type=code",
  },
  {
    id: "employee-importance",
    title: "Employee Importance",
    topic: "Graph",
    difficulty: "Easy",
    solution: "Build map; DFS sum importance values.",
    solutionLink: "https://leetcode.com/problems/employee-importance/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=employee+importance+leetcode",
    java: "https://github.com/search?q=employee+importance+leetcode+java&type=code",
  },
  {
    id: "minimum-depth-of-binary-tree-graph-bfs",
    title: "Minimum Depth of Binary Tree",
    topic: "Graph",
    difficulty: "Easy",
    solution: "BFS to first leaf (graph-style thinking).",
    solutionLink:
      "https://leetcode.com/problems/minimum-depth-of-binary-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+depth+of+binary+tree+leetcode",
    java: "https://github.com/search?q=minimum+depth+of+binary+tree+leetcode+java&type=code",
  },
  {
    id: "clone-graph",
    title: "Clone Graph",
    topic: "Graph",
    difficulty: "Easy",
    solution: "DFS/BFS with hashmap old->new nodes.",
    solutionLink: "https://leetcode.com/problems/clone-graph/solutions/",
    youtube: "https://www.youtube.com/results?search_query=clone+graph+leetcode",
    java: "https://github.com/search?q=clone+graph+leetcode+java&type=code",
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    topic: "Graph",
    difficulty: "Medium",
    solution: "DFS/BFS over grid components.",
    solutionLink: "https://leetcode.com/problems/number-of-islands/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=number+of+islands+leetcode",
    java: "https://github.com/search?q=number+of+islands+leetcode+java&type=code",
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Detect cycle with DFS or Kahn’s BFS.",
    solutionLink: "https://leetcode.com/problems/course-schedule/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=course+schedule+leetcode",
    java: "https://github.com/search?q=course+schedule+leetcode+java&type=code",
  },
  {
    id: "course-schedule-ii",
    title: "Course Schedule II",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Topological sort for valid ordering.",
    solutionLink: "https://leetcode.com/problems/course-schedule-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=course+schedule+ii+leetcode",
    java: "https://github.com/search?q=course+schedule+ii+leetcode+java&type=code",
  },
  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Multi-source BFS over grid.",
    solutionLink: "https://leetcode.com/problems/rotting-oranges/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=rotting+oranges+leetcode",
    java: "https://github.com/search?q=rotting+oranges+leetcode+java&type=code",
  },
  {
    id: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Reverse BFS/DFS from oceans to cells.",
    solutionLink:
      "https://leetcode.com/problems/pacific-atlantic-water-flow/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=pacific+atlantic+water+flow+leetcode",
    java: "https://github.com/search?q=pacific+atlantic+water+flow+leetcode+java&type=code",
  },
  {
    id: "surrounded-regions",
    title: "Surrounded Regions",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Mark border-connected regions via BFS/DFS.",
    solutionLink: "https://leetcode.com/problems/surrounded-regions/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=surrounded+regions+leetcode",
    java: "https://github.com/search?q=surrounded+regions+leetcode+java&type=code",
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    topic: "Graph",
    difficulty: "Medium",
    solution: "BFS through wildcard adjacency.",
    solutionLink: "https://leetcode.com/problems/word-ladder/solutions/",
    youtube: "https://www.youtube.com/results?search_query=word+ladder+leetcode",
    java: "https://github.com/search?q=word+ladder+leetcode+java&type=code",
  },
  {
    id: "graph-valid-tree",
    title: "Graph Valid Tree",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Check connected + edges = n-1.",
    solutionLink: "https://leetcode.com/problems/graph-valid-tree/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=graph+valid+tree+leetcode",
    java: "https://github.com/search?q=graph+valid+tree+leetcode+java&type=code",
  },
  {
    id: "network-delay-time",
    title: "Network Delay Time",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Dijkstra shortest paths from source.",
    solutionLink: "https://leetcode.com/problems/network-delay-time/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=network+delay+time+leetcode",
    java: "https://github.com/search?q=network+delay+time+leetcode+java&type=code",
  },
  {
    id: "minimum-height-trees",
    title: "Minimum Height Trees",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Trim leaves layer by layer.",
    solutionLink: "https://leetcode.com/problems/minimum-height-trees/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+height+trees+leetcode",
    java: "https://github.com/search?q=minimum+height+trees+leetcode+java&type=code",
  },
  {
    id: "is-graph-bipartite",
    title: "Is Graph Bipartite",
    topic: "Graph",
    difficulty: "Medium",
    solution: "BFS/DFS coloring with two colors.",
    solutionLink: "https://leetcode.com/problems/is-graph-bipartite/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=is+graph+bipartite+leetcode",
    java: "https://github.com/search?q=is+graph+bipartite+leetcode+java&type=code",
  },
  {
    id: "evaluate-division",
    title: "Evaluate Division",
    topic: "Graph",
    difficulty: "Medium",
    solution: "Graph with weights; DFS/BFS for ratios.",
    solutionLink: "https://leetcode.com/problems/evaluate-division/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=evaluate+division+leetcode",
    java: "https://github.com/search?q=evaluate+division+leetcode+java&type=code",
  },
  {
    id: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    topic: "Graph",
    difficulty: "Medium",
    solution: "BFS/DP by stops or modified Dijkstra.",
    solutionLink:
      "https://leetcode.com/problems/cheapest-flights-within-k-stops/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=cheapest+flights+within+k+stops+leetcode",
    java: "https://github.com/search?q=cheapest+flights+within+k+stops+leetcode+java&type=code",
  },
  {
    id: "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
    title: "Reorder Routes to Make All Paths Lead to the City Zero",
    topic: "Graph",
    difficulty: "Medium",
    solution: "DFS/BFS count edges needing reversal.",
    solutionLink:
      "https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reorder+routes+to+make+all+paths+lead+to+the+city+zero+leetcode",
    java: "https://github.com/search?q=reorder+routes+to+make+all+paths+lead+to+the+city+zero+leetcode+java&type=code",
  },
  {
    id: "all-paths-from-source-to-target",
    title: "All Paths From Source to Target",
    topic: "Graph",
    difficulty: "Medium",
    solution: "DFS backtracking over DAG.",
    solutionLink:
      "https://leetcode.com/problems/all-paths-from-source-to-target/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=all+paths+from+source+to+target+leetcode",
    java: "https://github.com/search?q=all+paths+from+source+to+target+leetcode+java&type=code",
  },
  {
    id: "alien-dictionary",
    title: "Alien Dictionary",
    topic: "Graph",
    difficulty: "Hard",
    solution: "Build precedence graph; topo sort.",
    solutionLink:
      "https://leetcode.com/problems/alien-dictionary/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=alien+dictionary+leetcode",
    java: "https://github.com/search?q=alien+dictionary+leetcode+java&type=code",
  },
  {
    id: "word-ladder-ii",
    title: "Word Ladder II",
    topic: "Graph",
    difficulty: "Hard",
    solution: "BFS layers + backtrack paths.",
    solutionLink: "https://leetcode.com/problems/word-ladder-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+ladder+ii+leetcode",
    java: "https://github.com/search?q=word+ladder+ii+leetcode+java&type=code",
  },
  {
    id: "critical-connections-in-a-network",
    title: "Critical Connections in a Network",
    topic: "Graph",
    difficulty: "Hard",
    solution: "Tarjan bridges algorithm.",
    solutionLink:
      "https://leetcode.com/problems/critical-connections-in-a-network/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=critical+connections+in+a+network+leetcode",
    java: "https://github.com/search?q=critical+connections+in+a+network+leetcode+java&type=code",
  },
  {
    id: "shortest-path-visiting-all-nodes",
    title: "Shortest Path Visiting All Nodes",
    topic: "Graph",
    difficulty: "Hard",
    solution: "BFS over state (node, mask).",
    solutionLink:
      "https://leetcode.com/problems/shortest-path-visiting-all-nodes/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=shortest+path+visiting+all+nodes+leetcode",
    java: "https://github.com/search?q=shortest+path+visiting+all+nodes+leetcode+java&type=code",
  },
  {
    id: "minimum-cost-to-connect-two-groups-of-points",
    title: "Minimum Cost to Connect Two Groups of Points",
    topic: "Graph",
    difficulty: "Hard",
    solution: "DP + bitmask or min-cost matching approach.",
    solutionLink:
      "https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+cost+to+connect+two+groups+of+points+leetcode",
    java: "https://github.com/search?q=minimum+cost+to+connect+two+groups+of+points+leetcode+java&type=code",
  },
  {
    id: "swim-in-rising-water",
    title: "Swim in Rising Water",
    topic: "Graph",
    difficulty: "Hard",
    solution: "Dijkstra or binary search + BFS.",
    solutionLink:
      "https://leetcode.com/problems/swim-in-rising-water/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=swim+in+rising+water+leetcode",
    java: "https://github.com/search?q=swim+in+rising+water+leetcode+java&type=code",
  },
  {
    id: "remove-max-number-of-edges-to-keep-graph-fully-traversable",
    title: "Remove Max Number of Edges to Keep Graph Fully Traversable",
    topic: "Graph",
    difficulty: "Hard",
    solution: "Union-Find for Alice/Bob with shared edges.",
    solutionLink:
      "https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+max+number+of+edges+to+keep+graph+fully+traversable+leetcode",
    java: "https://github.com/search?q=remove+max+number+of+edges+to+keep+graph+fully+traversable+leetcode+java&type=code",
  },
  {
    id: "bus-routes",
    title: "Bus Routes",
    topic: "Graph",
    difficulty: "Hard",
    solution: "BFS over routes using stop adjacency.",
    solutionLink: "https://leetcode.com/problems/bus-routes/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=bus+routes+leetcode",
    java: "https://github.com/search?q=bus+routes+leetcode+java&type=code",
  },
];

const ARRAYS_ITEMS: DsaItem[] = [
  {
    id: "two-sum-arrays",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Use a hash map for complements; O(n).",
    solutionLink: "https://leetcode.com/problems/two-sum/solutions/",
    youtube: "https://www.youtube.com/results?search_query=two+sum+leetcode",
    java: "https://github.com/search?q=two+sum+leetcode+java&type=code",
  },
  {
    id: "best-time-to-buy-and-sell-stock-arrays",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Track min price; update max profit.",
    solutionLink:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=best+time+to+buy+and+sell+stock+leetcode",
    java: "https://github.com/search?q=best+time+to+buy+and+sell+stock+leetcode+java&type=code",
  },
  {
    id: "maximum-subarray-arrays",
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Kadane’s algorithm.",
    solutionLink: "https://leetcode.com/problems/maximum-subarray/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+subarray+leetcode",
    java: "https://github.com/search?q=maximum+subarray+leetcode+java&type=code",
  },
  {
    id: "contains-duplicate-arrays",
    title: "Contains Duplicate",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Use a set to detect repeats.",
    solutionLink: "https://leetcode.com/problems/contains-duplicate/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=contains+duplicate+leetcode",
    java: "https://github.com/search?q=contains+duplicate+leetcode+java&type=code",
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Two pointers to compact non-zero values.",
    solutionLink: "https://leetcode.com/problems/move-zeroes/solutions/",
    youtube: "https://www.youtube.com/results?search_query=move+zeroes+leetcode",
    java: "https://github.com/search?q=move+zeroes+leetcode+java&type=code",
  },
  {
    id: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Slow pointer for unique positions.",
    solutionLink:
      "https://leetcode.com/problems/remove-duplicates-from-sorted-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+duplicates+from+sorted+array+leetcode",
    java: "https://github.com/search?q=remove+duplicates+from+sorted+array+leetcode+java&type=code",
  },
  {
    id: "missing-number",
    title: "Missing Number",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Use sum formula or XOR trick.",
    solutionLink: "https://leetcode.com/problems/missing-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=missing+number+leetcode",
    java: "https://github.com/search?q=missing+number+leetcode+java&type=code",
  },
  {
    id: "intersection-of-two-arrays",
    title: "Intersection of Two Arrays",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Use sets to compute intersection.",
    solutionLink:
      "https://leetcode.com/problems/intersection-of-two-arrays/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=intersection+of+two+arrays+leetcode",
    java: "https://github.com/search?q=intersection+of+two+arrays+leetcode+java&type=code",
  },
  {
    id: "plus-one",
    title: "Plus One",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Add with carry from the end.",
    solutionLink: "https://leetcode.com/problems/plus-one/solutions/",
    youtube: "https://www.youtube.com/results?search_query=plus+one+leetcode",
    java: "https://github.com/search?q=plus+one+leetcode+java&type=code",
  },
  {
    id: "find-pivot-index",
    title: "Find Pivot Index",
    topic: "Arrays",
    difficulty: "Easy",
    solution: "Track left sum vs total sum.",
    solutionLink: "https://leetcode.com/problems/find-pivot-index/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+pivot+index+leetcode",
    java: "https://github.com/search?q=find+pivot+index+leetcode+java&type=code",
  },
  {
    id: "three-sum",
    title: "3Sum",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Sort and use two pointers.",
    solutionLink: "https://leetcode.com/problems/3sum/solutions/",
    youtube: "https://www.youtube.com/results?search_query=3sum+leetcode",
    java: "https://github.com/search?q=3sum+leetcode+java&type=code",
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Two pointers with max area.",
    solutionLink:
      "https://leetcode.com/problems/container-with-most-water/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=container+with+most+water+leetcode",
    java: "https://github.com/search?q=container+with+most+water+leetcode+java&type=code",
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Prefix and suffix products.",
    solutionLink:
      "https://leetcode.com/problems/product-of-array-except-self/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=product+of+array+except+self+leetcode",
    java: "https://github.com/search?q=product+of+array+except+self+leetcode+java&type=code",
  },
  {
    id: "rotate-array",
    title: "Rotate Array",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Reverse parts in-place.",
    solutionLink: "https://leetcode.com/problems/rotate-array/solutions/",
    youtube: "https://www.youtube.com/results?search_query=rotate+array+leetcode",
    java: "https://github.com/search?q=rotate+array+leetcode+java&type=code",
  },
  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Use first row/col as markers.",
    solutionLink:
      "https://leetcode.com/problems/set-matrix-zeroes/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=set+matrix+zeroes+leetcode",
    java: "https://github.com/search?q=set+matrix+zeroes+leetcode+java&type=code",
  },
  {
    id: "spiral-matrix",
    title: "Spiral Matrix",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Traverse layer by layer.",
    solutionLink: "https://leetcode.com/problems/spiral-matrix/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=spiral+matrix+leetcode",
    java: "https://github.com/search?q=spiral+matrix+leetcode+java&type=code",
  },
  {
    id: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Prefix sum + hashmap counts.",
    solutionLink:
      "https://leetcode.com/problems/subarray-sum-equals-k/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=subarray+sum+equals+k+leetcode",
    java: "https://github.com/search?q=subarray+sum+equals+k+leetcode+java&type=code",
  },
  {
    id: "jump-game-arrays",
    title: "Jump Game",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Greedy reachability.",
    solutionLink: "https://leetcode.com/problems/jump-game/solutions/",
    youtube: "https://www.youtube.com/results?search_query=jump+game+leetcode",
    java: "https://github.com/search?q=jump+game+leetcode+java&type=code",
  },
  {
    id: "merge-intervals-arrays",
    title: "Merge Intervals",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Sort and merge overlaps.",
    solutionLink: "https://leetcode.com/problems/merge-intervals/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+intervals+leetcode",
    java: "https://github.com/search?q=merge+intervals+leetcode+java&type=code",
  },
  {
    id: "insert-interval-arrays",
    title: "Insert Interval",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Merge while inserting interval.",
    solutionLink: "https://leetcode.com/problems/insert-interval/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=insert+interval+leetcode",
    java: "https://github.com/search?q=insert+interval+leetcode+java&type=code",
  },
  {
    id: "sort-colors",
    title: "Sort Colors",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Dutch national flag partition.",
    solutionLink: "https://leetcode.com/problems/sort-colors/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sort+colors+leetcode",
    java: "https://github.com/search?q=sort+colors+leetcode+java&type=code",
  },
  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Quickselect or heap.",
    solutionLink:
      "https://leetcode.com/problems/kth-largest-element-in-an-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=kth+largest+element+in+an+array+leetcode",
    java: "https://github.com/search?q=kth+largest+element+in+an+array+leetcode+java&type=code",
  },
  {
    id: "find-all-duplicates-in-an-array",
    title: "Find All Duplicates in an Array",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Use index marking or cyclic placement.",
    solutionLink:
      "https://leetcode.com/problems/find-all-duplicates-in-an-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+all+duplicates+in+an+array+leetcode",
    java: "https://github.com/search?q=find+all+duplicates+in+an+array+leetcode+java&type=code",
  },
  {
    id: "gas-station-arrays",
    title: "Gas Station",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Greedy reset when tank negative.",
    solutionLink: "https://leetcode.com/problems/gas-station/solutions/",
    youtube: "https://www.youtube.com/results?search_query=gas+station+leetcode",
    java: "https://github.com/search?q=gas+station+leetcode+java&type=code",
  },
  {
    id: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    topic: "Arrays",
    difficulty: "Medium",
    solution: "Track max/min product ending at i.",
    solutionLink:
      "https://leetcode.com/problems/maximum-product-subarray/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+product+subarray+leetcode",
    java: "https://github.com/search?q=maximum+product+subarray+leetcode+java&type=code",
  },
  {
    id: "first-missing-positive",
    title: "First Missing Positive",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Place values in index positions.",
    solutionLink:
      "https://leetcode.com/problems/first-missing-positive/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=first+missing+positive+leetcode",
    java: "https://github.com/search?q=first+missing+positive+leetcode+java&type=code",
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Two pointers with max left/right.",
    solutionLink:
      "https://leetcode.com/problems/trapping-rain-water/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=trapping+rain+water+leetcode",
    java: "https://github.com/search?q=trapping+rain+water+leetcode+java&type=code",
  },
  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Monotonic stack of indices.",
    solutionLink:
      "https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=largest+rectangle+in+histogram+leetcode",
    java: "https://github.com/search?q=largest+rectangle+in+histogram+leetcode+java&type=code",
  },
  {
    id: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Monotonic deque of indices.",
    solutionLink:
      "https://leetcode.com/problems/sliding-window-maximum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sliding+window+maximum+leetcode",
    java: "https://github.com/search?q=sliding+window+maximum+leetcode+java&type=code",
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Binary search on partitions.",
    solutionLink:
      "https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=median+of+two+sorted+arrays+leetcode",
    java: "https://github.com/search?q=median+of+two+sorted+arrays+leetcode+java&type=code",
  },
  {
    id: "candy-arrays",
    title: "Candy",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Two-pass greedy for ratings.",
    solutionLink: "https://leetcode.com/problems/candy/solutions/",
    youtube: "https://www.youtube.com/results?search_query=candy+leetcode",
    java: "https://github.com/search?q=candy+leetcode+java&type=code",
  },
  {
    id: "maximum-gap",
    title: "Maximum Gap",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Bucket sort by pigeonhole principle.",
    solutionLink: "https://leetcode.com/problems/maximum-gap/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+gap+leetcode",
    java: "https://github.com/search?q=maximum+gap+leetcode+java&type=code",
  },
  {
    id: "create-maximum-number-arrays",
    title: "Create Maximum Number",
    topic: "Arrays",
    difficulty: "Hard",
    solution: "Greedy pick + merge max subsequences.",
    solutionLink:
      "https://leetcode.com/problems/create-maximum-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=create+maximum+number+leetcode",
    java: "https://github.com/search?q=create+maximum+number+leetcode+java&type=code",
  },
];

const BACKTRACKING_ITEMS: DsaItem[] = [
  {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack with constraints per row/col/box.",
    problemLink: "https://leetcode.com/problems/sudoku-solver/",
    solutionLink: "https://leetcode.com/problems/sudoku-solver/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sudoku+solver+leetcode",
    java: "https://github.com/search?q=sudoku+solver+leetcode+java&type=code",
  },
  {
    id: "n-queens",
    title: "N-Queens",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack with column/diagonal sets.",
    problemLink: "https://leetcode.com/problems/n-queens/",
    solutionLink: "https://leetcode.com/problems/n-queens/solutions/",
    youtube: "https://www.youtube.com/results?search_query=n+queens+leetcode",
    java: "https://github.com/search?q=n+queens+leetcode+java&type=code",
  },
  {
    id: "n-queens-ii",
    title: "N-Queens II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Count solutions using backtracking.",
    problemLink: "https://leetcode.com/problems/n-queens-ii/",
    solutionLink: "https://leetcode.com/problems/n-queens-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=n+queens+ii+leetcode",
    java: "https://github.com/search?q=n+queens+ii+leetcode+java&type=code",
  },
  {
    id: "word-ladder-ii-backtracking",
    title: "Word Ladder II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "BFS levels then backtrack paths.",
    problemLink: "https://leetcode.com/problems/word-ladder-ii/",
    solutionLink: "https://leetcode.com/problems/word-ladder-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+ladder+ii+leetcode",
    java: "https://github.com/search?q=word+ladder+ii+leetcode+java&type=code",
  },
  {
    id: "word-break-ii",
    title: "Word Break II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS with memo to build sentences.",
    problemLink: "https://leetcode.com/problems/word-break-ii/",
    solutionLink: "https://leetcode.com/problems/word-break-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+break+ii+leetcode",
    java: "https://github.com/search?q=word+break+ii+leetcode+java&type=code",
  },
  {
    id: "word-search-ii",
    title: "Word Search II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtracking with trie pruning.",
    problemLink: "https://leetcode.com/problems/word-search-ii/",
    solutionLink: "https://leetcode.com/problems/word-search-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+search+ii+leetcode",
    java: "https://github.com/search?q=word+search+ii+leetcode+java&type=code",
  },
  {
    id: "expression-add-operators",
    title: "Expression Add Operators",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS building expression with prev term tracking.",
    problemLink: "https://leetcode.com/problems/expression-add-operators/",
    solutionLink:
      "https://leetcode.com/problems/expression-add-operators/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=expression+add+operators+leetcode",
    java: "https://github.com/search?q=expression+add+operators+leetcode+java&type=code",
  },
  {
    id: "remove-invalid-parentheses",
    title: "Remove Invalid Parentheses",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS remove minimal invalid; dedupe with set.",
    problemLink: "https://leetcode.com/problems/remove-invalid-parentheses/",
    solutionLink:
      "https://leetcode.com/problems/remove-invalid-parentheses/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+invalid+parentheses+leetcode",
    java: "https://github.com/search?q=remove+invalid+parentheses+leetcode+java&type=code",
  },
  {
    id: "minimum-unique-word-abbreviation",
    title: "Minimum Unique Word Abbreviation",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack abbreviations with pruning.",
    problemLink: "https://leetcode.com/problems/minimum-unique-word-abbreviation/",
    solutionLink:
      "https://leetcode.com/problems/minimum-unique-word-abbreviation/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+unique+word+abbreviation+leetcode",
    java: "https://github.com/search?q=minimum+unique+word+abbreviation+leetcode+java&type=code",
  },
  {
    id: "word-squares",
    title: "Word Squares",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtracking with prefix map.",
    problemLink: "https://leetcode.com/problems/word-squares/",
    solutionLink: "https://leetcode.com/problems/word-squares/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=word+squares+leetcode",
    java: "https://github.com/search?q=word+squares+leetcode+java&type=code",
  },
  {
    id: "optimal-account-balancing",
    title: "Optimal Account Balancing",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS over debt list with pruning.",
    problemLink: "https://leetcode.com/problems/optimal-account-balancing/",
    solutionLink:
      "https://leetcode.com/problems/optimal-account-balancing/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=optimal+account+balancing+leetcode",
    java: "https://github.com/search?q=optimal+account+balancing+leetcode+java&type=code",
  },
  {
    id: "robot-room-cleaner",
    title: "Robot Room Cleaner",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS with backtracking turns and moves.",
    problemLink: "https://leetcode.com/problems/robot-room-cleaner/",
    solutionLink: "https://leetcode.com/problems/robot-room-cleaner/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=robot+room+cleaner+leetcode",
    java: "https://github.com/search?q=robot+room+cleaner+leetcode+java&type=code",
  },
  {
    id: "24-game",
    title: "24 Game",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Try all pair ops with recursion.",
    problemLink: "https://leetcode.com/problems/24-game/",
    solutionLink: "https://leetcode.com/problems/24-game/solutions/",
    youtube: "https://www.youtube.com/results?search_query=24+game+leetcode",
    java: "https://github.com/search?q=24+game+leetcode+java&type=code",
  },
  {
    id: "stickers-to-spell-word",
    title: "Stickers to Spell Word",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS with memo on remaining target.",
    problemLink: "https://leetcode.com/problems/stickers-to-spell-word/",
    solutionLink:
      "https://leetcode.com/problems/stickers-to-spell-word/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=stickers+to+spell+word+leetcode",
    java: "https://github.com/search?q=stickers+to+spell+word+leetcode+java&type=code",
  },
  {
    id: "sliding-puzzle",
    title: "Sliding Puzzle",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "BFS over board states.",
    problemLink: "https://leetcode.com/problems/sliding-puzzle/",
    solutionLink: "https://leetcode.com/problems/sliding-puzzle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sliding+puzzle+leetcode",
    java: "https://github.com/search?q=sliding+puzzle+leetcode+java&type=code",
  },
  {
    id: "unique-paths-iii",
    title: "Unique Paths III",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS visiting all cells exactly once.",
    problemLink: "https://leetcode.com/problems/unique-paths-iii/",
    solutionLink: "https://leetcode.com/problems/unique-paths-iii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=unique+paths+iii+leetcode",
    java: "https://github.com/search?q=unique+paths+iii+leetcode+java&type=code",
  },
  {
    id: "number-of-squareful-arrays",
    title: "Number of Squareful Arrays",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack permutations with pruning.",
    problemLink: "https://leetcode.com/problems/number-of-squareful-arrays/",
    solutionLink:
      "https://leetcode.com/problems/number-of-squareful-arrays/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=number+of+squareful+arrays+leetcode",
    java: "https://github.com/search?q=number+of+squareful+arrays+leetcode+java&type=code",
  },
  {
    id: "confusing-number-ii",
    title: "Confusing Number II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS build numbers with rotation mapping.",
    problemLink: "https://leetcode.com/problems/confusing-number-ii/",
    solutionLink:
      "https://leetcode.com/problems/confusing-number-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=confusing+number+ii+leetcode",
    java: "https://github.com/search?q=confusing+number+ii+leetcode+java&type=code",
  },
  {
    id: "brace-expansion-ii",
    title: "Brace Expansion II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS parse unions/concats with sets.",
    problemLink: "https://leetcode.com/problems/brace-expansion-ii/",
    solutionLink: "https://leetcode.com/problems/brace-expansion-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=brace+expansion+ii+leetcode",
    java: "https://github.com/search?q=brace+expansion+ii+leetcode+java&type=code",
  },
  {
    id: "tiling-a-rectangle-with-the-fewest-squares",
    title: "Tiling a Rectangle with the Fewest Squares",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack placements with pruning.",
    problemLink: "https://leetcode.com/problems/tiling-a-rectangle-with-the-fewest-squares/",
    solutionLink:
      "https://leetcode.com/problems/tiling-a-rectangle-with-the-fewest-squares/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=tiling+a+rectangle+with+the+fewest+squares+leetcode",
    java: "https://github.com/search?q=tiling+a+rectangle+with+the+fewest+squares+leetcode+java&type=code",
  },
  {
    id: "maximum-score-words-formed-by-letters",
    title: "Maximum Score Words Formed by Letters",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS include/exclude with letter counts.",
    problemLink: "https://leetcode.com/problems/maximum-score-words-formed-by-letters/",
    solutionLink:
      "https://leetcode.com/problems/maximum-score-words-formed-by-letters/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+score+words+formed+by+letters+leetcode",
    java: "https://github.com/search?q=maximum+score+words+formed+by+letters+leetcode+java&type=code",
  },
  {
    id: "verbal-arithmetic-puzzle",
    title: "Verbal Arithmetic Puzzle",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Column-wise DFS with digit assignments.",
    problemLink: "https://leetcode.com/problems/verbal-arithmetic-puzzle/",
    solutionLink:
      "https://leetcode.com/problems/verbal-arithmetic-puzzle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=verbal+arithmetic+puzzle+leetcode",
    java: "https://github.com/search?q=verbal+arithmetic+puzzle+leetcode+java&type=code",
  },
  {
    id: "probability-of-a-two-boxes-having-the-same-number-of-distinct-balls",
    title: "Probability of a Two Boxes Having The Same Number of Distinct Balls",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS distributions with combinatorics.",
    problemLink: "https://leetcode.com/problems/probability-of-a-two-boxes-having-the-same-number-of-distinct-balls/",
    solutionLink:
      "https://leetcode.com/problems/probability-of-a-two-boxes-having-the-same-number-of-distinct-balls/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=probability+of+a+two+boxes+having+the+same+number+of+distinct+balls+leetcode",
    java: "https://github.com/search?q=probability+of+a+two+boxes+having+the+same+number+of+distinct+balls+leetcode+java&type=code",
  },
  {
    id: "maximum-number-of-achievable-transfer-requests",
    title: "Maximum Number of Achievable Transfer Requests",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack subsets with balance checks.",
    problemLink: "https://leetcode.com/problems/maximum-number-of-achievable-transfer-requests/",
    solutionLink:
      "https://leetcode.com/problems/maximum-number-of-achievable-transfer-requests/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+number+of+achievable+transfer+requests+leetcode",
    java: "https://github.com/search?q=maximum+number+of+achievable+transfer+requests+leetcode+java&type=code",
  },
  {
    id: "distribute-repeating-integers",
    title: "Distribute Repeating Integers",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack counts with pruning.",
    problemLink: "https://leetcode.com/problems/distribute-repeating-integers/",
    solutionLink:
      "https://leetcode.com/problems/distribute-repeating-integers/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=distribute+repeating+integers+leetcode",
    java: "https://github.com/search?q=distribute+repeating+integers+leetcode+java&type=code",
  },
  {
    id: "find-minimum-time-to-finish-all-jobs",
    title: "Find Minimum Time to Finish All Jobs",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack worker assignments with pruning.",
    problemLink: "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs/",
    solutionLink:
      "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+minimum+time+to+finish+all+jobs+leetcode",
    java: "https://github.com/search?q=find+minimum+time+to+finish+all+jobs+leetcode+java&type=code",
  },
  {
    id: "maximize-score-after-n-operations",
    title: "Maximize Score After N Operations",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DP/backtracking on pairs with bitmask.",
    problemLink: "https://leetcode.com/problems/maximize-score-after-n-operations/",
    solutionLink:
      "https://leetcode.com/problems/maximize-score-after-n-operations/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximize+score+after+n+operations+leetcode",
    java: "https://github.com/search?q=maximize+score+after+n+operations+leetcode+java&type=code",
  },
  {
    id: "longest-subsequence-repeated-k-times",
    title: "Longest Subsequence Repeated k Times",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack candidates with pruning by frequency.",
    problemLink: "https://leetcode.com/problems/longest-subsequence-repeated-k-times/",
    solutionLink:
      "https://leetcode.com/problems/longest-subsequence-repeated-k-times/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=longest+subsequence+repeated+k+times+leetcode",
    java: "https://github.com/search?q=longest+subsequence+repeated+k+times+leetcode+java&type=code",
  },
  {
    id: "number-of-valid-move-combinations-on-chessboard",
    title: "Number of Valid Move Combinations On Chessboard",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack moves with collision checks.",
    problemLink: "https://leetcode.com/problems/number-of-valid-move-combinations-on-chessboard/",
    solutionLink:
      "https://leetcode.com/problems/number-of-valid-move-combinations-on-chessboard/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=number+of+valid+move+combinations+on+chessboard+leetcode",
    java: "https://github.com/search?q=number+of+valid+move+combinations+on+chessboard+leetcode+java&type=code",
  },
  {
    id: "maximum-path-quality-of-a-graph",
    title: "Maximum Path Quality of a Graph",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "DFS with time limit and revisit handling.",
    problemLink: "https://leetcode.com/problems/maximum-path-quality-of-a-graph/",
    solutionLink:
      "https://leetcode.com/problems/maximum-path-quality-of-a-graph/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+path+quality+of+a+graph+leetcode",
    java: "https://github.com/search?q=maximum+path+quality+of+a+graph+leetcode+java&type=code",
  },
  {
    id: "maximum-good-people-based-on-statements",
    title: "Maximum Good People Based on Statements",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack assignments with consistency checks.",
    problemLink: "https://leetcode.com/problems/maximum-good-people-based-on-statements/",
    solutionLink:
      "https://leetcode.com/problems/maximum-good-people-based-on-statements/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+good+people+based+on+statements+leetcode",
    java: "https://github.com/search?q=maximum+good+people+based+on+statements+leetcode+java&type=code",
  },
  {
    id: "smallest-divisible-digit-product-ii",
    title: "Smallest Divisible Digit Product II",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Search with pruning on digit products.",
    problemLink: "https://leetcode.com/problems/smallest-divisible-digit-product-ii/",
    solutionLink:
      "https://leetcode.com/problems/smallest-divisible-digit-product-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=smallest+divisible+digit+product+ii+leetcode",
    java: "https://github.com/search?q=smallest+divisible+digit+product+ii+leetcode+java&type=code",
  },
  {
    id: "next-special-palindrome-number",
    title: "Next Special Palindrome Number",
    topic: "Backtracking",
    difficulty: "Hard",
    solution: "Backtrack palindromes with digit constraints.",
    problemLink: "https://leetcode.com/problems/next-special-palindrome-number/",
    solutionLink:
      "https://leetcode.com/problems/next-special-palindrome-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=next+special+palindrome+number+leetcode",
    java: "https://github.com/search?q=next+special+palindrome+number+leetcode+java&type=code",
  },
];

const BINARY_SEARCH_ITEMS: DsaItem[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Standard binary search on sorted array.",
    solutionLink: "https://leetcode.com/problems/binary-search/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=binary+search+leetcode",
    java: "https://github.com/search?q=binary+search+leetcode+java&type=code",
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search to find lower bound.",
    solutionLink:
      "https://leetcode.com/problems/search-insert-position/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=search+insert+position+leetcode",
    java: "https://github.com/search?q=search+insert+position+leetcode+java&type=code",
  },
  {
    id: "sqrtx",
    title: "Sqrt(x)",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search on answer range.",
    solutionLink: "https://leetcode.com/problems/sqrtx/solutions/",
    youtube: "https://www.youtube.com/results?search_query=sqrtx+leetcode",
    java: "https://github.com/search?q=sqrtx+leetcode+java&type=code",
  },
  {
    id: "valid-perfect-square",
    title: "Valid Perfect Square",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search to match square.",
    solutionLink:
      "https://leetcode.com/problems/valid-perfect-square/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=valid+perfect+square+leetcode",
    java: "https://github.com/search?q=valid+perfect+square+leetcode+java&type=code",
  },
  {
    id: "guess-number-higher-or-lower",
    title: "Guess Number Higher or Lower",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search using API feedback.",
    solutionLink:
      "https://leetcode.com/problems/guess-number-higher-or-lower/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=guess+number+higher+or+lower+leetcode",
    java: "https://github.com/search?q=guess+number+higher+or+lower+leetcode+java&type=code",
  },
  {
    id: "first-bad-version",
    title: "First Bad Version",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search for first true.",
    solutionLink: "https://leetcode.com/problems/first-bad-version/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=first+bad+version+leetcode",
    java: "https://github.com/search?q=first+bad+version+leetcode+java&type=code",
  },
  {
    id: "arranging-coins",
    title: "Arranging Coins",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search maximum k with k(k+1)/2 <= n.",
    solutionLink: "https://leetcode.com/problems/arranging-coins/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=arranging+coins+leetcode",
    java: "https://github.com/search?q=arranging+coins+leetcode+java&type=code",
  },
  {
    id: "peak-index-in-a-mountain-array",
    title: "Peak Index in a Mountain Array",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search on peak slope.",
    solutionLink:
      "https://leetcode.com/problems/peak-index-in-a-mountain-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=peak+index+in+a+mountain+array+leetcode",
    java: "https://github.com/search?q=peak+index+in+a+mountain+array+leetcode+java&type=code",
  },
  {
    id: "intersection-of-two-arrays-bs",
    title: "Intersection of Two Arrays",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Sort and binary search each element.",
    solutionLink:
      "https://leetcode.com/problems/intersection-of-two-arrays/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=intersection+of+two+arrays+leetcode",
    java: "https://github.com/search?q=intersection+of+two+arrays+leetcode+java&type=code",
  },
  {
    id: "count-negative-numbers-in-a-sorted-matrix",
    title: "Count Negative Numbers in a Sorted Matrix",
    topic: "Binary Search",
    difficulty: "Easy",
    solution: "Binary search in each row.",
    solutionLink:
      "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=count+negative+numbers+in+a+sorted+matrix+leetcode",
    java: "https://github.com/search?q=count+negative+numbers+in+a+sorted+matrix+leetcode+java&type=code",
  },
  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search with rotated pivot logic.",
    solutionLink:
      "https://leetcode.com/problems/search-in-rotated-sorted-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=search+in+rotated+sorted+array+leetcode",
    java: "https://github.com/search?q=search+in+rotated+sorted+array+leetcode+java&type=code",
  },
  {
    id: "find-first-and-last-position-of-element-in-sorted-array",
    title: "Find First and Last Position of Element in Sorted Array",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Two binary searches for bounds.",
    solutionLink:
      "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+first+and+last+position+of+element+in+sorted+array+leetcode",
    java: "https://github.com/search?q=find+first+and+last+position+of+element+in+sorted+array+leetcode+java&type=code",
  },
  {
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on virtual 1D array.",
    solutionLink: "https://leetcode.com/problems/search-a-2d-matrix/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=search+a+2d+matrix+leetcode",
    java: "https://github.com/search?q=search+a+2d+matrix+leetcode+java&type=code",
  },
  {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on rotated array.",
    solutionLink:
      "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+minimum+in+rotated+sorted+array+leetcode",
    java: "https://github.com/search?q=find+minimum+in+rotated+sorted+array+leetcode+java&type=code",
  },
  {
    id: "find-peak-element",
    title: "Find Peak Element",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on slope changes.",
    solutionLink: "https://leetcode.com/problems/find-peak-element/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+peak+element+leetcode",
    java: "https://github.com/search?q=find+peak+element+leetcode+java&type=code",
  },
  {
    id: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on eating speed.",
    solutionLink:
      "https://leetcode.com/problems/koko-eating-bananas/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=koko+eating+bananas+leetcode",
    java: "https://github.com/search?q=koko+eating+bananas+leetcode+java&type=code",
  },
  {
    id: "capacity-to-ship-packages-within-d-days",
    title: "Capacity To Ship Packages Within D Days",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on capacity.",
    solutionLink:
      "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=capacity+to+ship+packages+within+d+days+leetcode",
    java: "https://github.com/search?q=capacity+to+ship+packages+within+d+days+leetcode+java&type=code",
  },
  {
    id: "find-the-smallest-divisor-given-a-threshold",
    title: "Find the Smallest Divisor Given a Threshold",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on divisor.",
    solutionLink:
      "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+the+smallest+divisor+given+a+threshold+leetcode",
    java: "https://github.com/search?q=find+the+smallest+divisor+given+a+threshold+leetcode+java&type=code",
  },
  {
    id: "search-in-rotated-sorted-array-ii",
    title: "Search in Rotated Sorted Array II",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search with duplicates.",
    solutionLink:
      "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=search+in+rotated+sorted+array+ii+leetcode",
    java: "https://github.com/search?q=search+in+rotated+sorted+array+ii+leetcode+java&type=code",
  },
  {
    id: "time-based-key-value-store",
    title: "Time Based Key-Value Store",
    topic: "Binary Search",
    difficulty: "Medium",
    solution: "Binary search on timestamps.",
    solutionLink:
      "https://leetcode.com/problems/time-based-key-value-store/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=time+based+key+value+store+leetcode",
    java: "https://github.com/search?q=time+based+key+value+store+leetcode+java&type=code",
  },
  {
    id: "median-of-two-sorted-arrays-bs",
    title: "Median of Two Sorted Arrays",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on partition.",
    solutionLink:
      "https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=median+of+two+sorted+arrays+leetcode",
    java: "https://github.com/search?q=median+of+two+sorted+arrays+leetcode+java&type=code",
  },
  {
    id: "split-array-largest-sum",
    title: "Split Array Largest Sum",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on maximum subarray sum.",
    solutionLink:
      "https://leetcode.com/problems/split-array-largest-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=split+array+largest+sum+leetcode",
    java: "https://github.com/search?q=split+array+largest+sum+leetcode+java&type=code",
  },
  {
    id: "find-minimum-in-rotated-sorted-array-ii-hard",
    title: "Find Minimum in Rotated Sorted Array II",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search with duplicates.",
    solutionLink:
      "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+minimum+in+rotated+sorted+array+ii+leetcode",
    java: "https://github.com/search?q=find+minimum+in+rotated+sorted+array+ii+leetcode+java&type=code",
  },
  {
    id: "maximum-value-at-a-given-index-in-a-bounded-array",
    title: "Maximum Value at a Given Index in a Bounded Array",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on value with sum constraints.",
    solutionLink:
      "https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+value+at+a+given+index+in+a+bounded+array+leetcode",
    java: "https://github.com/search?q=maximum+value+at+a+given+index+in+a+bounded+array+leetcode+java&type=code",
  },
  {
    id: "nth-magical-number",
    title: "Nth Magical Number",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search with lcm counting.",
    solutionLink: "https://leetcode.com/problems/nth-magical-number/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=nth+magical+number+leetcode",
    java: "https://github.com/search?q=nth+magical+number+leetcode+java&type=code",
  },
  {
    id: "kth-smallest-number-in-multiplication-table",
    title: "Kth Smallest Number in Multiplication Table",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on value with count function.",
    solutionLink:
      "https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=kth+smallest+number+in+multiplication+table+leetcode",
    java: "https://github.com/search?q=kth+smallest+number+in+multiplication+table+leetcode+java&type=code",
  },
  {
    id: "find-kth-smallest-pair-distance",
    title: "Find Kth Smallest Pair Distance",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on distance with two pointers count.",
    solutionLink:
      "https://leetcode.com/problems/find-kth-smallest-pair-distance/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+kth+smallest+pair+distance+leetcode",
    java: "https://github.com/search?q=find+kth+smallest+pair+distance+leetcode+java&type=code",
  },
  {
    id: "smallest-rectangle-enclosing-black-pixels",
    title: "Smallest Rectangle Enclosing Black Pixels",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search boundaries on rows/cols.",
    solutionLink:
      "https://leetcode.com/problems/smallest-rectangle-enclosing-black-pixels/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=smallest+rectangle+enclosing+black+pixels+leetcode",
    java: "https://github.com/search?q=smallest+rectangle+enclosing+black+pixels+leetcode+java&type=code",
  },
  {
    id: "divide-chocolate",
    title: "Divide Chocolate",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on minimum sweetness.",
    solutionLink: "https://leetcode.com/problems/divide-chocolate/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=divide+chocolate+leetcode",
    java: "https://github.com/search?q=divide+chocolate+leetcode+java&type=code",
  },
  {
    id: "minimum-number-of-days-to-make-m-bouquets",
    title: "Minimum Number of Days to Make m Bouquets",
    topic: "Binary Search",
    difficulty: "Hard",
    solution: "Binary search on day with feasibility check.",
    solutionLink:
      "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+number+of+days+to+make+m+bouquets+leetcode",
    java: "https://github.com/search?q=minimum+number+of+days+to+make+m+bouquets+leetcode+java&type=code",
  },
];

const PRIORITY_QUEUE_ITEMS: DsaItem[] = [
  {
    id: "kth-largest-element-in-a-stream",
    title: "Kth Largest Element in a Stream",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Min-heap of size k.",
    solutionLink:
      "https://leetcode.com/problems/kth-largest-element-in-a-stream/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=kth+largest+element+in+a+stream+leetcode",
    java: "https://github.com/search?q=kth+largest+element+in+a+stream+leetcode+java&type=code",
  },
  {
    id: "last-stone-weight",
    title: "Last Stone Weight",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Max-heap to smash largest stones.",
    solutionLink: "https://leetcode.com/problems/last-stone-weight/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=last+stone+weight+leetcode",
    java: "https://github.com/search?q=last+stone+weight+leetcode+java&type=code",
  },
  {
    id: "relative-ranks",
    title: "Relative Ranks",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Max-heap or sort indices by score.",
    solutionLink: "https://leetcode.com/problems/relative-ranks/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=relative+ranks+leetcode",
    java: "https://github.com/search?q=relative+ranks+leetcode+java&type=code",
  },
  {
    id: "minimum-cost-to-move-chips-to-the-same-position",
    title: "Minimum Cost to Move Chips to The Same Position",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Count odds/evens, take min.",
    solutionLink:
      "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+cost+to+move+chips+to+the+same+position+leetcode",
    java: "https://github.com/search?q=minimum+cost+to+move+chips+to+the+same+position+leetcode+java&type=code",
  },
  {
    id: "find-subsequence-of-length-k-with-the-largest-sum",
    title: "Find Subsequence of Length K With the Largest Sum",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Keep top-k by value with indices.",
    solutionLink:
      "https://leetcode.com/problems/find-subsequence-of-length-k-with-the-largest-sum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+subsequence+of+length+k+with+the+largest+sum+leetcode",
    java: "https://github.com/search?q=find+subsequence+of+length+k+with+the+largest+sum+leetcode+java&type=code",
  },
  {
    id: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Max-heap of size k or quickselect.",
    solutionLink:
      "https://leetcode.com/problems/k-closest-points-to-origin/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=k+closest+points+to+origin+leetcode",
    java: "https://github.com/search?q=k+closest+points+to+origin+leetcode+java&type=code",
  },
  {
    id: "sort-characters-by-frequency",
    title: "Sort Characters By Frequency",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Max-heap by frequency.",
    solutionLink:
      "https://leetcode.com/problems/sort-characters-by-frequency/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sort+characters+by+frequency+leetcode",
    java: "https://github.com/search?q=sort+characters+by+frequency+leetcode+java&type=code",
  },
  {
    id: "top-k-frequent-elements-pq",
    title: "Top K Frequent Elements",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Count frequencies then heap.",
    solutionLink:
      "https://leetcode.com/problems/top-k-frequent-elements/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=top+k+frequent+elements+leetcode",
    java: "https://github.com/search?q=top+k+frequent+elements+leetcode+java&type=code",
  },
  {
    id: "maximum-product-of-two-elements-in-an-array",
    title: "Maximum Product of Two Elements in an Array",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Take two largest elements.",
    solutionLink:
      "https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+product+of+two+elements+in+an+array+leetcode",
    java: "https://github.com/search?q=maximum+product+of+two+elements+in+an+array+leetcode+java&type=code",
  },
  {
    id: "final-array-state-after-k-multiplication-operations",
    title: "Final Array State After K Multiplication Operations",
    topic: "Priority Queue",
    difficulty: "Easy",
    solution: "Min-heap to apply operations.",
    solutionLink:
      "https://leetcode.com/problems/final-array-state-after-k-multiplication-operations/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=final+array+state+after+k+multiplication+operations+leetcode",
    java: "https://github.com/search?q=final+array+state+after+k+multiplication+operations+leetcode+java&type=code",
  },
  {
    id: "kth-largest-element-in-an-array-pq",
    title: "Kth Largest Element in an Array",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Min-heap size k or quickselect.",
    solutionLink:
      "https://leetcode.com/problems/kth-largest-element-in-an-array/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=kth+largest+element+in+an+array+leetcode",
    java: "https://github.com/search?q=kth+largest+element+in+an+array+leetcode+java&type=code",
  },
  {
    id: "top-k-frequent-words",
    title: "Top K Frequent Words",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Heap with frequency and lex order.",
    solutionLink:
      "https://leetcode.com/problems/top-k-frequent-words/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=top+k+frequent+words+leetcode",
    java: "https://github.com/search?q=top+k+frequent+words+leetcode+java&type=code",
  },
  {
    id: "merge-k-sorted-lists-pq",
    title: "Merge k Sorted Lists",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Min-heap over list heads.",
    solutionLink:
      "https://leetcode.com/problems/merge-k-sorted-lists/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=merge+k+sorted+lists+leetcode",
    java: "https://github.com/search?q=merge+k+sorted+lists+leetcode+java&type=code",
  },
  {
    id: "task-scheduler-pq",
    title: "Task Scheduler",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Greedy with max-heap for counts.",
    solutionLink: "https://leetcode.com/problems/task-scheduler/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=task+scheduler+leetcode",
    java: "https://github.com/search?q=task+scheduler+leetcode+java&type=code",
  },
  {
    id: "reorganize-string-pq",
    title: "Reorganize String",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Max-heap to arrange chars.",
    solutionLink: "https://leetcode.com/problems/reorganize-string/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=reorganize+string+leetcode",
    java: "https://github.com/search?q=reorganize+string+leetcode+java&type=code",
  },
  {
    id: "furthest-building-you-can-reach",
    title: "Furthest Building You Can Reach",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Use min-heap for ladders on largest climbs.",
    solutionLink:
      "https://leetcode.com/problems/furthest-building-you-can-reach/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=furthest+building+you+can+reach+leetcode",
    java: "https://github.com/search?q=furthest+building+you+can+reach+leetcode+java&type=code",
  },
  {
    id: "find-k-pairs-with-smallest-sums",
    title: "Find K Pairs with Smallest Sums",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Min-heap over pair sums.",
    solutionLink:
      "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+k+pairs+with+smallest+sums+leetcode",
    java: "https://github.com/search?q=find+k+pairs+with+smallest+sums+leetcode+java&type=code",
  },
  {
    id: "find-k-closest-elements",
    title: "K Closest Elements",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Heap or binary search + two pointers.",
    solutionLink:
      "https://leetcode.com/problems/find-k-closest-elements/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+k+closest+elements+leetcode",
    java: "https://github.com/search?q=find+k+closest+elements+leetcode+java&type=code",
  },
  {
    id: "ugly-number-ii",
    title: "Ugly Number II",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Min-heap to generate next numbers.",
    solutionLink: "https://leetcode.com/problems/ugly-number-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=ugly+number+ii+leetcode",
    java: "https://github.com/search?q=ugly+number+ii+leetcode+java&type=code",
  },
  {
    id: "smallest-range-covering-elements-from-k-lists",
    title: "Smallest Range Covering Elements from K Lists",
    topic: "Priority Queue",
    difficulty: "Medium",
    solution: "Min-heap over heads with tracking max.",
    solutionLink:
      "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=smallest+range+covering+elements+from+k+lists+leetcode",
    java: "https://github.com/search?q=smallest+range+covering+elements+from+k+lists+leetcode+java&type=code",
  },
  {
    id: "sliding-window-maximum-pq",
    title: "Sliding Window Maximum",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Max-heap or deque for window max.",
    solutionLink:
      "https://leetcode.com/problems/sliding-window-maximum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sliding+window+maximum+leetcode",
    java: "https://github.com/search?q=sliding+window+maximum+leetcode+java&type=code",
  },
  {
    id: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Two heaps for lower/upper halves.",
    solutionLink:
      "https://leetcode.com/problems/find-median-from-data-stream/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=find+median+from+data+stream+leetcode",
    java: "https://github.com/search?q=find+median+from+data+stream+leetcode+java&type=code",
  },
  {
    id: "ipo-pq",
    title: "IPO",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Sort by capital, max-heap profits.",
    solutionLink: "https://leetcode.com/problems/ipo/solutions/",
    youtube: "https://www.youtube.com/results?search_query=ipo+leetcode",
    java: "https://github.com/search?q=ipo+leetcode+java&type=code",
  },
  {
    id: "minimum-cost-to-hire-k-workers",
    title: "Minimum Cost to Hire K Workers",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Sort by ratio, max-heap of quality.",
    solutionLink:
      "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+cost+to+hire+k+workers+leetcode",
    java: "https://github.com/search?q=minimum+cost+to+hire+k+workers+leetcode+java&type=code",
  },
  {
    id: "trapping-rain-water-ii",
    title: "Trapping Rain Water II",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Min-heap BFS over boundary.",
    solutionLink:
      "https://leetcode.com/problems/trapping-rain-water-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=trapping+rain+water+ii+leetcode",
    java: "https://github.com/search?q=trapping+rain+water+ii+leetcode+java&type=code",
  },
  {
    id: "maximum-performance-of-a-team-pq",
    title: "Maximum Performance of a Team",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Heap speeds with efficiency sorting.",
    solutionLink:
      "https://leetcode.com/problems/maximum-performance-of-a-team/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximum+performance+of+a+team+leetcode",
    java: "https://github.com/search?q=maximum+performance+of+a+team+leetcode+java&type=code",
  },
  {
    id: "swim-in-rising-water-pq",
    title: "Swim in Rising Water",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Dijkstra with min-heap.",
    solutionLink:
      "https://leetcode.com/problems/swim-in-rising-water/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=swim+in+rising+water+leetcode",
    java: "https://github.com/search?q=swim+in+rising+water+leetcode+java&type=code",
  },
  {
    id: "meeting-rooms-iii",
    title: "Meeting Rooms III",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Two heaps for available/occupied rooms.",
    solutionLink: "https://leetcode.com/problems/meeting-rooms-iii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=meeting+rooms+iii+leetcode",
    java: "https://github.com/search?q=meeting+rooms+iii+leetcode+java&type=code",
  },
  {
    id: "minimum-number-of-refueling-stops-pq",
    title: "Minimum Number of Refueling Stops",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Max-heap of fuels as you progress.",
    solutionLink:
      "https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=minimum+number+of+refueling+stops+leetcode",
    java: "https://github.com/search?q=minimum+number+of+refueling+stops+leetcode+java&type=code",
  },
  {
    id: "the-skyline-problem",
    title: "The Skyline Problem",
    topic: "Priority Queue",
    difficulty: "Hard",
    solution: "Sweep line with max-heap.",
    solutionLink: "https://leetcode.com/problems/the-skyline-problem/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=the+skyline+problem+leetcode",
    java: "https://github.com/search?q=the+skyline+problem+leetcode+java&type=code",
  },
];

const STACK_QUEUE_ITEMS: DsaItem[] = [
  {
    id: "valid-parentheses-stack",
    title: "Valid Parentheses",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Use stack to match brackets.",
    solutionLink: "https://leetcode.com/problems/valid-parentheses/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=valid+parentheses+leetcode",
    java: "https://github.com/search?q=valid+parentheses+leetcode+java&type=code",
  },
  {
    id: "implement-stack-using-queues",
    title: "Implement Stack using Queues",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Push then rotate queue.",
    solutionLink:
      "https://leetcode.com/problems/implement-stack-using-queues/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=implement+stack+using+queues+leetcode",
    java: "https://github.com/search?q=implement+stack+using+queues+leetcode+java&type=code",
  },
  {
    id: "implement-queue-using-stacks",
    title: "Implement Queue using Stacks",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Use two stacks for amortized O(1).",
    solutionLink:
      "https://leetcode.com/problems/implement-queue-using-stacks/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=implement+queue+using+stacks+leetcode",
    java: "https://github.com/search?q=implement+queue+using+stacks+leetcode+java&type=code",
  },
  {
    id: "min-stack",
    title: "Min Stack",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Stack with running min.",
    solutionLink: "https://leetcode.com/problems/min-stack/solutions/",
    youtube: "https://www.youtube.com/results?search_query=min+stack+leetcode",
    java: "https://github.com/search?q=min+stack+leetcode+java&type=code",
  },
  {
    id: "baseball-game",
    title: "Baseball Game",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Stack simulate operations.",
    solutionLink: "https://leetcode.com/problems/baseball-game/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=baseball+game+leetcode",
    java: "https://github.com/search?q=baseball+game+leetcode+java&type=code",
  },
  {
    id: "backspace-string-compare",
    title: "Backspace String Compare",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Process with stack or two pointers.",
    solutionLink:
      "https://leetcode.com/problems/backspace-string-compare/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=backspace+string+compare+leetcode",
    java: "https://github.com/search?q=backspace+string+compare+leetcode+java&type=code",
  },
  {
    id: "remove-all-adjacent-duplicates-in-string",
    title: "Remove All Adjacent Duplicates In String",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Stack remove duplicates.",
    solutionLink:
      "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+all+adjacent+duplicates+in+string+leetcode",
    java: "https://github.com/search?q=remove+all+adjacent+duplicates+in+string+leetcode+java&type=code",
  },
  {
    id: "next-greater-element-i",
    title: "Next Greater Element I",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Monotonic stack for next greater.",
    solutionLink:
      "https://leetcode.com/problems/next-greater-element-i/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=next+greater+element+i+leetcode",
    java: "https://github.com/search?q=next+greater+element+i+leetcode+java&type=code",
  },
  {
    id: "number-of-recent-calls",
    title: "Number of Recent Calls",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Queue of timestamps.",
    solutionLink:
      "https://leetcode.com/problems/number-of-recent-calls/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=number+of+recent+calls+leetcode",
    java: "https://github.com/search?q=number+of+recent+calls+leetcode+java&type=code",
  },
  {
    id: "make-the-string-great",
    title: "Make The String Great",
    topic: "Stack/Queue",
    difficulty: "Easy",
    solution: "Stack remove adjacent cases.",
    solutionLink:
      "https://leetcode.com/problems/make-the-string-great/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=make+the+string+great+leetcode",
    java: "https://github.com/search?q=make+the+string+great+leetcode+java&type=code",
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack of indices.",
    solutionLink: "https://leetcode.com/problems/daily-temperatures/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=daily+temperatures+leetcode",
    java: "https://github.com/search?q=daily+temperatures+leetcode+java&type=code",
  },
  {
    id: "next-greater-element-ii",
    title: "Next Greater Element II",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack with circular array.",
    solutionLink:
      "https://leetcode.com/problems/next-greater-element-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=next+greater+element+ii+leetcode",
    java: "https://github.com/search?q=next+greater+element+ii+leetcode+java&type=code",
  },
  {
    id: "online-stock-span",
    title: "Online Stock Span",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack of pairs.",
    solutionLink:
      "https://leetcode.com/problems/online-stock-span/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=online+stock+span+leetcode",
    java: "https://github.com/search?q=online+stock+span+leetcode+java&type=code",
  },
  {
    id: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Stack evaluate tokens.",
    solutionLink:
      "https://leetcode.com/problems/evaluate-reverse-polish-notation/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=evaluate+reverse+polish+notation+leetcode",
    java: "https://github.com/search?q=evaluate+reverse+polish+notation+leetcode+java&type=code",
  },
  {
    id: "decode-string",
    title: "Decode String",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Stack for counts and partial strings.",
    solutionLink: "https://leetcode.com/problems/decode-string/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=decode+string+leetcode",
    java: "https://github.com/search?q=decode+string+leetcode+java&type=code",
  },
  {
    id: "asteroid-collision",
    title: "Asteroid Collision",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Stack simulate collisions.",
    solutionLink:
      "https://leetcode.com/problems/asteroid-collision/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=asteroid+collision+leetcode",
    java: "https://github.com/search?q=asteroid+collision+leetcode+java&type=code",
  },
  {
    id: "simplify-path",
    title: "Simplify Path",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Stack directories.",
    solutionLink: "https://leetcode.com/problems/simplify-path/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=simplify+path+leetcode",
    java: "https://github.com/search?q=simplify+path+leetcode+java&type=code",
  },
  {
    id: "remove-k-digits-stack",
    title: "Remove K Digits",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack to remove larger digits.",
    solutionLink: "https://leetcode.com/problems/remove-k-digits/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+k+digits+leetcode",
    java: "https://github.com/search?q=remove+k+digits+leetcode+java&type=code",
  },
  {
    id: "sum-of-subarray-minimums",
    title: "Sum of Subarray Minimums",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack for contribution.",
    solutionLink:
      "https://leetcode.com/problems/sum-of-subarray-minimums/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sum+of+subarray+minimums+leetcode",
    java: "https://github.com/search?q=sum+of+subarray+minimums+leetcode+java&type=code",
  },
  {
    id: "largest-rectangle-in-histogram-stack",
    title: "Largest Rectangle in Histogram",
    topic: "Stack/Queue",
    difficulty: "Medium",
    solution: "Monotonic stack of heights.",
    solutionLink:
      "https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=largest+rectangle+in+histogram+leetcode",
    java: "https://github.com/search?q=largest+rectangle+in+histogram+leetcode+java&type=code",
  },
  {
    id: "trapping-rain-water-stack",
    title: "Trapping Rain Water",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Stack or two pointers.",
    solutionLink:
      "https://leetcode.com/problems/trapping-rain-water/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=trapping+rain+water+leetcode",
    java: "https://github.com/search?q=trapping+rain+water+leetcode+java&type=code",
  },
  {
    id: "sliding-window-maximum-stack",
    title: "Sliding Window Maximum",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Deque or heap for window max.",
    solutionLink:
      "https://leetcode.com/problems/sliding-window-maximum/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=sliding+window+maximum+leetcode",
    java: "https://github.com/search?q=sliding+window+maximum+leetcode+java&type=code",
  },
  {
    id: "shortest-subarray-with-sum-at-least-k",
    title: "Shortest Subarray with Sum at Least K",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Monotonic queue with prefix sums.",
    solutionLink:
      "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=shortest+subarray+with+sum+at+least+k+leetcode",
    java: "https://github.com/search?q=shortest+subarray+with+sum+at+least+k+leetcode+java&type=code",
  },
  {
    id: "maximal-rectangle",
    title: "Maximal Rectangle",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Histogram stack per row.",
    solutionLink: "https://leetcode.com/problems/maximal-rectangle/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=maximal+rectangle+leetcode",
    java: "https://github.com/search?q=maximal+rectangle+leetcode+java&type=code",
  },
  {
    id: "basic-calculator",
    title: "Basic Calculator",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Stack for sign and nested expressions.",
    solutionLink: "https://leetcode.com/problems/basic-calculator/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=basic+calculator+leetcode",
    java: "https://github.com/search?q=basic+calculator+leetcode+java&type=code",
  },
  {
    id: "basic-calculator-ii",
    title: "Basic Calculator II",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Stack for precedence of * and /.",
    solutionLink: "https://leetcode.com/problems/basic-calculator-ii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=basic+calculator+ii+leetcode",
    java: "https://github.com/search?q=basic+calculator+ii+leetcode+java&type=code",
  },
  {
    id: "basic-calculator-iii",
    title: "Basic Calculator III",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Stack/recursion with parentheses.",
    solutionLink: "https://leetcode.com/problems/basic-calculator-iii/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=basic+calculator+iii+leetcode",
    java: "https://github.com/search?q=basic+calculator+iii+leetcode+java&type=code",
  },
  {
    id: "longest-valid-parentheses-stack",
    title: "Longest Valid Parentheses",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Stack indices to track valid lengths.",
    solutionLink:
      "https://leetcode.com/problems/longest-valid-parentheses/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=longest+valid+parentheses+leetcode",
    java: "https://github.com/search?q=longest+valid+parentheses+leetcode+java&type=code",
  },
  {
    id: "remove-invalid-parentheses-stack",
    title: "Remove Invalid Parentheses",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "BFS/DFS remove minimal invalid.",
    solutionLink:
      "https://leetcode.com/problems/remove-invalid-parentheses/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=remove+invalid+parentheses+leetcode",
    java: "https://github.com/search?q=remove+invalid+parentheses+leetcode+java&type=code",
  },
  {
    id: "parse-lisp-expression",
    title: "Parse Lisp Expression",
    topic: "Stack/Queue",
    difficulty: "Hard",
    solution: "Recursive descent / stack parse.",
    solutionLink:
      "https://leetcode.com/problems/parse-lisp-expression/solutions/",
    youtube:
      "https://www.youtube.com/results?search_query=parse+lisp+expression+leetcode",
    java: "https://github.com/search?q=parse+lisp+expression+leetcode+java&type=code",
  },
];
const DSA_ITEMS: DsaItem[] = [
  ...LINKED_LIST_ITEMS,
  ...DP_ITEMS,
  ...TREE_ITEMS,
  ...GREEDY_ITEMS,
  ...GRAPH_ITEMS,
  ...ARRAYS_ITEMS,
  ...BACKTRACKING_ITEMS,
  ...BINARY_SEARCH_ITEMS,
  ...PRIORITY_QUEUE_ITEMS,
  ...STACK_QUEUE_ITEMS,
];

const difficultyClass: Record<DsaItem["difficulty"], string> = {
  Easy: "chip chip-sky",
  Medium: "chip chip-lemon",
  Hard: "chip chip-peach",
};

const TOPICS = [
  "All",
  "Arrays",
  "Linked List",
  "Binary Search",
  "Priority Queue",
  "Stack/Queue",
  "Greedy",
  "Tree",
  "Graph",
  "DP",
  "Backtracking",
] as const;

export default function Home() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"All" | DsaItem["difficulty"]>("All");
  const [topicFilter, setTopicFilter] =
    useState<(typeof TOPICS)[number]>("All");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "today">("all");
  const [dailyIds, setDailyIds] = useState<string[]>([]);
  const [dailyCount, setDailyCount] = useState(10);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [celebratingIds, setCelebratingIds] = useState<string[]>([]);
  const pageSize = 10;

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProgress(JSON.parse(raw));
      } catch {
        setProgress({});
      }
    }
    const todayRaw = localStorage.getItem(getTodayKey());
    if (todayRaw) {
      try {
        const parsed = JSON.parse(todayRaw) as { ids?: string[] };
        if (Array.isArray(parsed.ids)) {
          setDailyIds(parsed.ids);
        }
      } catch {
        setDailyIds([]);
      }
    }
    setHydrated(true);
  }, []);

  const idMap = useMemo(() => {
    return new Map(DSA_ITEMS.map((item) => [item.id, item]));
  }, []);

  const dailyItems = useMemo(() => {
    return dailyIds
      .map((id) => idMap.get(id))
      .filter(Boolean) as DsaItem[];
  }, [dailyIds, idMap]);

  const filteredItems = useMemo(() => {
    if (viewMode === "today") return dailyItems;
    return DSA_ITEMS.filter((item) => {
      const matchDifficulty = filter === "All" || item.difficulty === filter;
      const matchTopic = topicFilter === "All" || item.topic === topicFilter;
      return matchDifficulty && matchTopic;
    });
  }, [filter, topicFilter, viewMode, dailyItems]);

  const isAllSection =
    viewMode === "all" && filter === "All" && topicFilter === "All";
  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleItems = useMemo(() => {
    if (!isAllSection) return filteredItems;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, isAllSection, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [filter, topicFilter, viewMode]);

  const generateDailySheet = (requested = dailyCount) => {
    setDailyError(null);
    if (requested <= 0 || requested > DSA_ITEMS.length) {
      setDailyError(
        `Please choose a number between 1 and ${DSA_ITEMS.length}.`,
      );
      return;
    }
    const byTopic = new Map<string, DsaItem[]>();
    DSA_ITEMS.forEach((item) => {
      const list = byTopic.get(item.topic) ?? [];
      list.push(item);
      byTopic.set(item.topic, list);
    });
    const topics = shuffle([...byTopic.keys()]);
    const selected: DsaItem[] = [];
    const used = new Set<string>();
    for (const topic of topics) {
      if (selected.length >= requested) break;
      const pool = byTopic.get(topic)?.filter((item) => !used.has(item.id));
      if (!pool || pool.length === 0) continue;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      selected.push(pick);
      used.add(pick.id);
    }
    if (selected.length < requested) {
      const remaining = shuffle(
        DSA_ITEMS.filter((item) => !used.has(item.id)),
      );
      selected.push(...remaining.slice(0, requested - selected.length));
    }
    const ids = selected.map((item) => item.id);
    setDailyIds(ids);
    localStorage.setItem(getTodayKey(), JSON.stringify({ ids }));
    setViewMode("today");
  };

  const clearDailySheet = () => {
    setDailyIds([]);
    localStorage.removeItem(getTodayKey());
    setViewMode("all");
  };

  const doneCount = useMemo(() => {
    if (!hydrated) return 0;
    return DSA_ITEMS.filter((item) => progress[item.id]).length;
  }, [progress, hydrated]);

  const percent = Math.round((doneCount / DSA_ITEMS.length) * 100);

  const triggerCelebrate = (id: string) => {
    setCelebratingIds((prev) => [...prev, id]);
    window.setTimeout(() => {
      setCelebratingIds((prev) => prev.filter((item) => item !== id));
    }, 900);
  };

  const handleToggle = (id: string) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    triggerCelebrate(id);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-10">
        <header className="glass rounded-[28px] p-6 sm:rounded-[32px] sm:p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="chip chip-accent">DSA Sheet Studio</span>
              <h1 className="font-display mt-4 text-3xl font-semibold leading-tight text-violet-50 sm:text-4xl md:text-5xl">
                Let's Master DSA !
              </h1>
              <p className="text-soft mt-4 text-sm leading-relaxed sm:text-base md:text-lg">
                A living DSA notebook — progress tracking, bite-size solutions, and instant access to handpicked Java & video references.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="chip chip-sky">Curated Problem List</span>
                <span className="chip chip-peach">Auto Progress Saving</span>
                <span className="chip chip-lemon">Personalized References</span>
              </div>
            </div>
            <div className="glass-strong w-full rounded-[24px] p-5 sm:rounded-[28px] sm:p-6 md:w-[320px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-soft text-[0.65rem] uppercase tracking-[0.35em]">
                    Progress
                  </p>
                  <p className="font-display text-3xl font-semibold">
                    {percent}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-soft text-sm">Solved</p>
                  <p className="text-2xl font-semibold text-violet-50">
                    {doneCount}/{DSA_ITEMS.length}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-3 w-full rounded-full bg-violet-900/80">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#a855f7,#f472b6)] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-soft mt-3 text-xs">
                Changes are saved instantly. No account required.
              </p>
            </div>
          </div>
        </header>

        <section className="glass rounded-[28px] p-5 sm:rounded-[32px] sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-violet-50 sm:text-2xl">
                DSA Sheet
              </h2>
              <p className="text-soft text-sm">
                Written solution, YouTube explainer, and Java code link in one
                table.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Easy", "Medium", "Hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFilter(level)}
                  className={`chip ${
                    level === "All"
                      ? "chip-accent"
                      : level === "Easy"
                        ? "chip-sky"
                        : level === "Medium"
                          ? "chip-lemon"
                          : "chip-peach"
                  } ${filter === level ? "chip-active" : "chip-muted"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-soft text-xs uppercase tracking-[0.3em]">
                Today Sheet
              </span>
              <p className="text-sm">
                {dailyIds.length > 0
                  ? `${dailyIds.length} questions ready`
                  : "Generate a fresh random set for today."}
              </p>
              {dailyError && (
                <p className="text-xs text-rose-200">{dailyError}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-soft text-xs">Count</label>
              <input
                type="number"
                min={1}
                max={DSA_ITEMS.length}
                value={dailyCount}
                onChange={(event) => {
                  const next = Number.parseInt(event.target.value, 10);
                  if (Number.isNaN(next)) {
                    setDailyCount(1);
                    return;
                  }
                  setDailyCount(next);
                }}
                className="h-9 w-20 rounded-full border border-white/10 bg-white/10 px-3 text-sm text-violet-50 outline-none focus:border-violet-400"
              />
              <button
                type="button"
                className="link-pill"
                onClick={() => generateDailySheet()}
              >
                Generate
              </button>
              {dailyIds.length > 0 && (
                <button
                  type="button"
                  className="link-pill"
                  onClick={() => generateDailySheet(dailyCount)}
                >
                  Regenerate
                </button>
              )}
              {dailyIds.length > 0 && viewMode !== "today" && (
                <button
                  type="button"
                  className="link-pill"
                  onClick={() => setViewMode("today")}
                >
                  View Today
                </button>
              )}
              {viewMode === "today" && (
                <button
                  type="button"
                  className="link-pill"
                  onClick={() => setViewMode("all")}
                >
                  Back to Full
                </button>
              )}
              {dailyIds.length > 0 && (
                <button
                  type="button"
                  className="link-pill"
                  onClick={clearDailySheet}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setTopicFilter(topic)}
                className={`chip chip-accent ${
                  topicFilter === topic ? "chip-active" : "chip-muted"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

            <div className="table-shell glass-strong mt-6">
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Done</th>
                        <th>Question</th>
                        <th>Topic</th>
                        <th>Difficulty</th>
                        <th className="hint-col">Hint</th>
                        <th>YouTube</th>
                        <th>Java Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((item) => {
                        const checked = !!progress[item.id];
                        return (
                          <tr key={item.id}>
                            <td>
                              <button
                                type="button"
                                aria-pressed={checked}
                                aria-label={`Mark ${item.title} as done`}
                                className={`checkbox celebrate-btn ${
                                  celebratingIds.includes(item.id)
                                    ? "is-celebrating"
                                    : ""
                                }`}
                                data-checked={checked}
                                onClick={() => handleToggle(item.id)}
                              >
                                <span
                                  className={`celebrate-burst ${
                                    celebratingIds.includes(item.id)
                                      ? "is-active"
                                      : ""
                                  }`}
                                >
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                </span>
                                <svg
                                  width="14"
                                  height="10"
                                  viewBox="0 0 14 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 5L5 9L13 1"
                                    stroke="#0f766e"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </td>
                            <td>
                              <div className="flex flex-col gap-1">
                                {getProblemLink(item) ? (
                                  <a
                                    href={getProblemLink(item)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-violet-50 transition hover:text-white"
                                  >
                                    {item.title}
                                  </a>
                                ) : (
                                  <span className="font-semibold text-violet-50">
                                    {item.title}
                                  </span>
                                )}
                                <span className="text-soft text-xs">
                                  {item.id.replaceAll("-", " ")}
                                </span>
                              </div>
                            </td>
                            <td className="text-soft">{item.topic}</td>
                            <td>
                              <span className={difficultyClass[item.difficulty]}>
                                {item.difficulty}
                              </span>
                            </td>
                            <td className="hint-col">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-soft">{item.solution}</span>
                              </div>
                            </td>
                            <td>
                              <a
                                className="link-pill"
                                href={item.youtube}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Watch
                              </a>
                            </td>
                            <td>
                              <a
                                className="link-pill"
                                href={item.java}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Java
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden">
                <div className="flex flex-col gap-4 p-4">
                  {visibleItems.map((item) => {
                    const checked = !!progress[item.id];
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {getProblemLink(item) ? (
                              <a
                                href={getProblemLink(item)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-violet-50 transition hover:text-white"
                              >
                                {item.title}
                              </a>
                            ) : (
                              <p className="font-semibold text-violet-50">
                                {item.title}
                              </p>
                            )}
                            <p className="text-soft text-xs">
                              {item.id.replaceAll("-", " ")}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-pressed={checked}
                            aria-label={`Mark ${item.title} as done`}
                            className={`checkbox celebrate-btn ${
                              celebratingIds.includes(item.id)
                                ? "is-celebrating"
                                : ""
                            }`}
                            data-checked={checked}
                            onClick={() => handleToggle(item.id)}
                          >
                            <span
                              className={`celebrate-burst ${
                                celebratingIds.includes(item.id)
                                  ? "is-active"
                                  : ""
                              }`}
                            >
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                              <span />
                            </span>
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 5L5 9L13 1"
                                stroke="#c084fc"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="chip chip-accent">{item.topic}</span>
                          <span className={difficultyClass[item.difficulty]}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-soft mt-3 text-sm">
                          {item.solution}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            className="link-pill"
                            href={item.youtube}
                            target="_blank"
                            rel="noreferrer"
                          >
                            YouTube
                          </a>
                          <a
                            className="link-pill"
                            href={item.java}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Java
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isAllSection && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-soft">
                  Showing {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredItems.length)} of{" "}
                  {filteredItems.length}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="link-pill"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <span className="text-soft">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="link-pill"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          <p className="text-soft mt-4 text-xs">
            Tip: swap the links with your preferred resources or add new rows to
            extend the sheet.
          </p>
        </section>
        <footer className="footer-glow text-soft text-center text-xs sm:text-sm">
          <a
            href="https://www.linkedin.com/in/soumik-karmakar-547a591a5/"
            target="_blank"
            rel="noreferrer"
          >
            Made with 💗 by Soumik
          </a>
        </footer>
      </div>
    </div>
  );
}
