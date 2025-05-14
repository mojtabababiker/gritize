export default {
  algorithms: [
    {
      title: "Reverse Linked List",
      type: "algorithm",
      description:
        "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nConstraints:\nThe number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
      hint: "Think about iterating through the list and changing the `next` pointer of each node. You'll need to keep track of the previous node.",
      difficulty: "easy",
      slug: "reverse-linked-list",
    },
    {
      title: "Binary Tree Inorder Traversal",
      type: "algorithm",
      description:
        "Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\nExample:\nInput: root = [1,null,2,3]\nOutput: [1,3,2]\n\nConstraints:\nThe number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100",
      hint: "Recall the definition of inorder traversal (Left, Root, Right). Recursion is a natural fit here. Consider the base case for the recursion.",
      difficulty: "easy",
      slug: "binary-tree-inorder-traversal",
    },
    {
      title: "Validate Binary Search Tree",
      type: "algorithm",
      description:
        "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\nA valid BST is defined as follows:\nThe left subtree of a node contains only nodes with keys less than the node's key.\nThe right subtree of a node contains only nodes with keys greater than the node's key.\nBoth the left and right subtrees must also be binary search trees.\n\nExample 1:\nInput: root = [2,1,3]\nOutput: true\n\nExample 2:\nInput: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: The root node's value is 5 but its right child's value is 4.\n\nConstraints:\nThe number of nodes in the tree is in the range [1, 10^4].\n-2^31 <= Node.val <= 2^31 - 1",
      hint: "Simply checking `node.left.val < node.val` and `node.right.val > node.val` is not enough. Consider the range of valid values for each node as you traverse down the tree.",
      difficulty: "mid",
      slug: "validate-binary-search-tree",
    },
    {
      title: "Implement Queue using Stacks",
      type: "algorithm",
      description:
        'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).\n\nImplement the MyQueue class:\n`void push(int x)` Pushes element x to the back of the queue.\n`int pop()` Removes the element from the front of the queue and returns it.\n`int peek()` Returns the element at the front of the queue.\n`boolean empty()` Returns true if the queue is empty, false otherwise.\n\nNotes:\nYou must use only standard operations of a stack, which means only `push to top`, `peek/pop from top`, `size`, and `is empty` operations are valid.\nDepending on your language, the stack may not be supported natively. You may simulate a stack using a list or deque (double-ended queue) as long as you use only a stack\'s standard operations.\n\nExample:\nInput\n["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]\nOutput\n[null, null, null, 1, 1, false]\n\nConstraints:\n1 <= x <= 9\nAt most 100 calls will be made to push, pop, peek, and empty.\nAll the calls to pop and peek are valid.',
      hint: "Think about how stacks (LIFO) and queues (FIFO) differ. How can you use one stack for pushing and another to reverse the order for popping/peeking?",
      difficulty: "easy",
      slug: "implement-queue-using-stacks",
    },
    {
      title: "Search in Rotated Sorted Array",
      type: "algorithm",
      description:
        "There is an integer array nums sorted in ascending order (with distinct values).\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.\nnums is an ascending array that is possibly rotated.\n-10^4 <= target <= 10^4",
      hint: "Standard binary search works on sorted arrays. How can you adapt binary search here? In each step, determine which half (left or right of mid) is sorted and check if the target lies within that sorted half.",
      difficulty: "mid",
      slug: "search-in-rotated-sorted-array",
    },
  ],
  codingPatterns: [
    {
      patternName: "Sliding Window",
      totalProblems: 5,
      info: "Used for problems involving contiguous subarrays or substrings. Maintains a 'window' over a portion of the data and slides it across. Efficient for finding max/min, sums, or properties within a specific-sized or dynamically-sized range.",
      problems: [
        {
          title: "Maximum Sum Subarray of Size K",
          type: "coding-pattern",
          description:
            "Given an array of positive integers `nums` and a positive integer `k`, find the maximum sum of any contiguous subarray of size `k`.\n\nExample 1:\nInput: nums = [2, 1, 5, 1, 3, 2], k = 3\nOutput: 9\nExplanation: The subarray [5, 1, 3] has the maximum sum 9.\n\nExample 2:\nInput: nums = [1, 4, 2, 10, 2, 3, 1, 0, 20], k = 4\nOutput: 24\nExplanation: The subarray [4, 2, 10, 2] has the maximum sum 18, but [10, 2, 3, 1] has sum 16, and [2, 3, 1, 0] has sum 6. The maximum is [10, 2, 3, 1] actually no, [4, 2, 10, 2] is 18. [10, 2, 3, 1] is 16. [2, 3, 1, 0] is 6. Wait, [2, 10, 2, 3] is 17. [10, 2, 3, 1] = 16. The last one [3, 1, 0, 20] = 24. So output is 24. \n\nConstraints:\n1 <= nums.length <= 10^5\n1 <= nums[i] <= 10^4\n1 <= k <= nums.length",
          hint: "Calculate the sum of the first `k` elements. Then, slide the window one element at a time: subtract the element leaving the window and add the element entering the window. Keep track of the maximum sum found.",
          difficulty: "easy",
          slug: "maximum-sum-subarray-of-size-k",
        },
        {
          title: "Minimum Size Subarray Sum",
          type: "coding-pattern",
          description:
            "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is greater than or equal to `target`. If there is no such subarray, return 0 instead.\n\nExample 1:\nInput: target = 7, nums = [2,3,1,2,4,3]\nOutput: 2\nExplanation: The subarray [4,3] has the minimal length under the problem constraint.\n\nExample 2:\nInput: target = 4, nums = [1,4,4]\nOutput: 1\n\nExample 3:\nInput: target = 11, nums = [1,1,1,1,1,1,1,1]\nOutput: 0\n\nConstraints:\n1 <= target <= 10^9\n1 <= nums.length <= 10^5\n1 <= nums[i] <= 10^5",
          hint: "Use a variable-size sliding window. Expand the window by moving the right pointer and adding the element to the current sum. If the sum meets the target, try shrinking the window from the left to find the minimum length, updating the minimum length found so far.",
          difficulty: "mid",
          slug: "minimum-size-subarray-sum",
        },
        {
          title: "Longest Substring Without Repeating Characters",
          type: "coding-pattern",
          description:
            'Given a string `s`, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.\n\nExample 2:\nInput: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.\n\nExample 3:\nInput: s = "pwwkew"\nOutput: 3\nExplanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.\n\nConstraints:\n0 <= s.length <= 5 * 10^4\n`s` consists of English letters, digits, symbols and spaces.',
          hint: "Use a sliding window approach with a hash set or hash map to keep track of characters currently in the window. Expand the window by moving the right pointer. If a repeating character is found, shrink the window from the left until the duplicate is removed.",
          difficulty: "mid",
          slug: "longest-substring-without-repeating-characters",
        },
        {
          title: "Permutation in String",
          type: "coding-pattern",
          description:
            'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\nIn other words, return `true` if one of `s1`\'s permutations is the substring of `s2`.\n\nExample 1:\nInput: s1 = "ab", s2 = "eidbaooo"\nOutput: true\nExplanation: s2 contains one permutation of s1 ("ba").\n\nExample 2:\nInput: s1 = "ab", s2 = "eidboaoo"\nOutput: false\n\nConstraints:\n1 <= s1.length, s2.length <= 10^4\ns1 and s2 consist of lowercase English letters.',
          hint: "Use a fixed-size sliding window on `s2` with size equal to `s1.length`. Maintain character frequency counts for `s1` and the current window in `s2`. Compare the frequency maps as the window slides.",
          difficulty: "mid",
          slug: "permutation-in-string",
        },
        {
          title: "Minimum Window Substring",
          type: "coding-pattern",
          description:
            'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string "".\nThe testcases will be generated such that the answer is unique.\nA substring is a contiguous sequence of characters within the string.\n\nExample 1:\nInput: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"\nExplanation: The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.\n\nExample 2:\nInput: s = "a", t = "a"\nOutput: "a"\n\nExample 3:\nInput: s = "a", t = "aa"\nOutput: ""\nExplanation: Both \'a\'s from t must be included in the window.\nSince the largest window of s only has one \'a\', return empty string.\n\nConstraints:\nm == s.length\nn == t.length\n1 <= m, n <= 10^5\ns and t consist of uppercase and lowercase English letters.\n',
          hint: "Use a variable-size sliding window. Maintain frequency counts for characters in `t` and the characters in the current window. Expand the window until it contains all characters from `t`. Then, shrink the window from the left as much as possible while still satisfying the condition, updating the minimum window found.",
          difficulty: "advanced",
          slug: "minimum-window-substring",
        },
      ],
    },
    {
      patternName: "Two Pointers",
      totalProblems: 5,
      info: "Uses two pointers that typically iterate through a data structure (like an array or linked list). Pointers can move towards each other, away from each other, or in the same direction. Efficient for problems involving pairs, sorted data, or palindromes.",
      problems: [
        {
          title: "Valid Palindrome",
          type: "coding-pattern",
          description:
            'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\nExample 1:\nInput: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.\n\nExample 2:\nInput: s = "race a car"\nOutput: false\nExplanation: "raceacar" is not a palindrome.\n\nExample 3:\nInput: s = " "\nOutput: true\nExplanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.\n\nConstraints:\n1 <= s.length <= 2 * 10^5\n`s` consists only of printable ASCII characters.',
          hint: "Use two pointers, one starting at the beginning (`left`) and one at the end (`right`) of the string. Move them inwards, skipping non-alphanumeric characters. Compare the characters (case-insensitive) at the pointers. If they don't match at any point, it's not a palindrome.",
          difficulty: "easy",
          slug: "valid-palindrome",
        },
        {
          title: "Two Sum II - Input Array Is Sorted",
          type: "coding-pattern",
          description:
            "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Let these two numbers be `numbers[index1]` and `numbers[index2]` where `1 <= index1 < index2 <= numbers.length`.\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\nThe tests are generated such that there is exactly one solution. You may not use the same element twice.\nYour solution must use only constant extra space.\n\nExample 1:\nInput: numbers = [2,7,11,15], target = 9\nOutput: [1,2]\nExplanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].\n\nExample 2:\nInput: numbers = [2,3,4], target = 6\nOutput: [1,3]\nExplanation: The sum of 2 and 4 is 6. Therefore, index1 = 1, index2 = 3. We return [1, 3].\n\nExample 3:\nInput: numbers = [-1,0], target = -1\nOutput: [1,2]\nExplanation: The sum of -1 and 0 is -1. Therefore, index1 = 1, index2 = 2. We return [1, 2].\n\nConstraints:\n2 <= numbers.length <= 3 * 10^4\n-1000 <= numbers[i] <= 1000\n`numbers` is sorted in non-decreasing order.\n-1000 <= target <= 1000\nThe tests are generated such that there is exactly one solution.",
          hint: "Use two pointers, `left` starting at index 0 and `right` starting at the last index. If the sum `numbers[left] + numbers[right]` is less than the target, increment `left`. If it's greater, decrement `right`. If it equals the target, you've found the pair.",
          difficulty: "easy",
          slug: "two-sum-ii-input-array-is-sorted",
        },
        {
          title: "Squares of a Sorted Array",
          type: "coding-pattern",
          description:
            "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.\n\nExample 1:\nInput: nums = [-4,-1,0,3,10]\nOutput: [0,1,9,16,100]\nExplanation: After squaring, the array becomes [16,1,0,9,100]. After sorting, it becomes [0,1,9,16,100].\n\nExample 2:\nInput: nums = [-7,-3,2,3,11]\nOutput: [4,9,9,49,121]\n\nConstraints:\n1 <= nums.length <= 10^4\n-10^4 <= nums[i] <= 10^4\n`nums` is sorted in non-decreasing order.\n\nFollow up: Squaring each element and sorting the new array is very trivial, could you find an O(n) solution using a different approach?",
          hint: "Use two pointers, `left` at the start and `right` at the end of the input array. Compare the absolute values of `nums[left]` and `nums[right]`. The larger square belongs at the end of the result array. Place it there and move the corresponding pointer inward. Fill the result array from right to left.",
          difficulty: "easy",
          slug: "squares-of-a-sorted-array",
        },
        {
          title: "3Sum",
          type: "coding-pattern",
          description:
            "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.\n\nConstraints:\n3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
          hint: "First, sort the array. Then, iterate through the array with a single pointer `i`. For each `nums[i]`, use the Two Pointers pattern (left = `i+1`, right = `n-1`) on the rest of the array to find pairs `(nums[left], nums[right])` such that `nums[i] + nums[left] + nums[right] == 0`. Be careful to handle duplicates.",
          difficulty: "mid",
          slug: "3sum",
        },
        {
          title: "Container With Most Water",
          type: "coding-pattern",
          description:
            "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\nReturn the maximum amount of water a container can store.\nNotice that you may not slant the container.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\nn == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
          hint: "Use two pointers, `left` at the start and `right` at the end. Calculate the area formed by `height[left]` and `height[right]`. To potentially find a larger area, you must move the pointer pointing to the shorter line inward. Why? Because moving the taller line inward will never increase the height constraint and will decrease the width.",
          difficulty: "mid",
          slug: "container-with-most-water",
        },
      ],
    },
    {
      patternName: "Basic Dynamic Programming",
      totalProblems: 5,
      info: "Solves problems by breaking them down into smaller overlapping subproblems. Stores the results of subproblems to avoid redundant calculations. Often involves defining a recurrence relation and building up a solution table (often an array or matrix).",
      problems: [
        {
          title: "Climbing Stairs",
          type: "coding-pattern",
          description:
            "You are climbing a staircase. It takes `n` steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\nInput: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step\n\nConstraints:\n1 <= n <= 45",
          hint: "Consider the last step taken to reach step `n`. It could have been a single step from `n-1` or a double step from `n-2`. The total ways to reach `n` is the sum of ways to reach `n-1` and ways to reach `n-2`. This resembles the Fibonacci sequence. Define `dp[i]` as the number of ways to reach step `i`.",
          difficulty: "easy",
          slug: "climbing-stairs",
        },
        {
          title: "House Robber",
          type: "coding-pattern",
          description:
            "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4.\n\nExample 2:\nInput: nums = [2,7,9,3,1]\nOutput: 12\nExplanation: Rob house 1 (money = 2), rob house 3 (money = 9), and rob house 5 (money = 1).\nTotal amount you can rob = 2 + 9 + 1 = 12.\n\nConstraints:\n1 <= nums.length <= 100\n0 <= nums[i] <= 400",
          hint: "Define `dp[i]` as the maximum amount of money that can be robbed up to house `i`. To calculate `dp[i]`, you have two choices: either rob house `i` (in which case you cannot rob house `i-1`, so the amount is `nums[i] + dp[i-2]`) or don't rob house `i` (in which case the amount is `dp[i-1]`). Take the maximum of these two choices.",
          difficulty: "mid",
          slug: "house-robber",
        },
        {
          title: "Coin Change",
          type: "coding-pattern",
          description:
            "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\nYou may assume that you have an infinite number of each kind of coin.\n\nExample 1:\nInput: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1\n\nExample 2:\nInput: coins = [2], amount = 3\nOutput: -1\n\nExample 3:\nInput: coins = [1], amount = 0\nOutput: 0\n\nConstraints:\n1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
          hint: "Define `dp[i]` as the minimum number of coins needed to make amount `i`. Initialize `dp` array (e.g., with infinity, except `dp[0]=0`). Iterate from amount 1 to `amount`. For each amount `i`, iterate through the `coins`. If `coin <= i`, update `dp[i]` with the minimum of its current value and `dp[i - coin] + 1`.",
          difficulty: "mid",
          slug: "coin-change",
        },
        {
          title: "Longest Increasing Subsequence",
          type: "coding-pattern",
          description:
            "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\nA subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, [3,6,2,7] is a subsequence of the array [0,3,1,6,2,2,7].\n\nExample 1:\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.\n\nExample 2:\nInput: nums = [0,1,0,3,2,3]\nOutput: 4\n\nExample 3:\nInput: nums = [7,7,7,7,7,7,7]\nOutput: 1\n\nConstraints:\n1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4\n\nFollow up: Can you come up with an algorithm that runs in O(n log(n)) time complexity?",
          hint: "Define `dp[i]` as the length of the longest increasing subsequence ending at index `i`. To compute `dp[i]`, iterate through all `j` from 0 to `i-1`. If `nums[i] > nums[j]`, then we can potentially extend the LIS ending at `j`. So, `dp[i] = max(dp[i], dp[j] + 1)`. The final answer is the maximum value in the `dp` array.",
          difficulty: "mid",
          slug: "longest-increasing-subsequence",
        },
        {
          title: "Unique Paths",
          type: "coding-pattern",
          description:
            "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\nThe test cases are generated so that the answer will be less than or equal to 2 * 10^9.\n\nExample 1:\nInput: m = 3, n = 7\nOutput: 28\n\nExample 2:\nInput: m = 3, n = 2\nOutput: 3\nExplanation:\nFrom the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down\n\nConstraints:\n1 <= m, n <= 100",
          hint: "Define `dp[i][j]` as the number of unique paths to reach cell `(i, j)`. The robot can only reach `(i, j)` from `(i-1, j)` (coming down) or `(i, j-1)` (coming right). Therefore, `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. The base cases are the cells in the first row and first column, which have only 1 path to reach.",
          difficulty: "mid",
          slug: "unique-paths",
        },
      ],
    },
    {
      patternName: "Breadth-First Search (BFS)",
      totalProblems: 5,
      info: "A graph traversal algorithm that explores neighbors level by level. Uses a queue to keep track of nodes to visit. Ideal for finding the shortest path in unweighted graphs, level order traversal of trees, and exploring connectivity.",
      problems: [
        {
          title: "Binary Tree Level Order Traversal",
          type: "coding-pattern",
          description:
            "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n\nExample 2:\nInput: root = [1]\nOutput: [[1]]\n\nExample 3:\nInput: root = []\nOutput: []\n\nConstraints:\nThe number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000",
          hint: "Use a queue. Start by adding the root node to the queue. While the queue is not empty, process nodes level by level. In each iteration, determine the number of nodes currently in the queue (this is the size of the current level). Dequeue that many nodes, add their values to a list for the current level, and enqueue their children.",
          difficulty: "easy",
          slug: "binary-tree-level-order-traversal",
        },
        {
          title: "Minimum Depth of Binary Tree",
          type: "coding-pattern",
          description:
            "Given a binary tree, find its minimum depth.\nThe minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.\nNote: A leaf is a node with no children.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 2\n\nExample 2:\nInput: root = [2,null,3,null,4,null,5,null,6]\nOutput: 5\n\nConstraints:\nThe number of nodes in the tree is in the range [0, 10^5].\n-1000 <= Node.val <= 1000",
          hint: "Use BFS. Start with the root at level 1. Explore the tree level by level. The first time you encounter a leaf node (a node with no left and no right child), the current level number is the minimum depth.",
          difficulty: "easy",
          slug: "minimum-depth-of-binary-tree",
        },
        {
          title: "Word Ladder",
          type: "coding-pattern",
          description:
            'A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\nEvery adjacent pair of words differs by a single letter.\nEvery `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.\n`sk == endWord`.\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or 0 if no such sequence exists.\n\nExample 1:\nInput: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]\nOutput: 5\nExplanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.\n\nExample 2:\nInput: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]\nOutput: 0\nExplanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.\n\nConstraints:\n1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nwordList[i].length == beginWord.length\n`beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.\n`beginWord` != `endWord`\nAll the words in `wordList` are unique.',
          hint: "Think of this as a graph problem where words are nodes and an edge exists if two words differ by one letter. Use BFS to find the shortest path from `beginWord` to `endWord`. Keep track of visited words to avoid cycles. The level in BFS corresponds to the length of the transformation sequence.",
          difficulty: "advanced",
          slug: "word-ladder",
        },
        {
          title: "Rotting Oranges",
          type: "coding-pattern",
          description:
            "You are given an `m x n` grid where each cell can have one of three values:\n`0` representing an empty cell,\n`1` representing a fresh orange, or\n`2` representing a rotten orange.\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.\n\nExample 1:\nInput: grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4\n\nExample 2:\nInput: grid = [[2,1,1],[0,1,1],[1,0,1]]\nOutput: -1\nExplanation: The orange in the bottom left corner (row 2, col 0) is never rotten, because rotting only happens 4-directionally.\n\nExample 3:\nInput: grid = [[0,2]]\nOutput: 0\nExplanation: Since there are already no fresh oranges at minute 0, the answer is just 0.\n\nConstraints:\nm == grid.length\nn == grid[i].length\n1 <= m, n <= 10\ngrid[i][j]` is `0`, `1`, or `2`.",
          hint: "This is a multi-source BFS problem. Initialize the queue with all initially rotten oranges (value 2). Keep track of the number of fresh oranges. Perform BFS level by level, where each level represents one minute. In each step, rot adjacent fresh oranges, decrement the fresh count, and add the newly rotten oranges to the queue. If the queue becomes empty, check if the fresh count is zero.",
          difficulty: "mid",
          slug: "rotting-oranges",
        },
        {
          title: "Shortest Path in Binary Matrix",
          type: "coding-pattern",
          description:
            "Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return -1.\nA clear path in a binary matrix is a path from the top-left cell (i.e., (0, 0)) to the bottom-right cell (i.e., (n - 1, n - 1)) such that:\nAll the visited cells of the path are 0.\nAll the adjacent cells of the path are 8-directionally connected (i.e., they are different and they share an edge or a corner).\nThe length of a clear path is the number of visited cells of this path.\n\nExample 1:\nInput: grid = [[0,1],[1,0]]\nOutput: 2\n\nExample 2:\nInput: grid = [[0,0,0],[1,1,0],[1,1,0]]\nOutput: 4\n\nExample 3:\nInput: grid = [[1,0,0],[1,1,0],[1,1,0]]\nOutput: -1\n\nConstraints:\nn == grid.length\nn == grid[i].length\n1 <= n <= 100\ngrid[i][j] is 0 or 1",
          hint: "Use BFS starting from `(0, 0)`. Explore neighbors in 8 directions. Keep track of the distance (path length) for each cell. Mark visited cells (e.g., by changing their value in the grid or using a separate visited set) to avoid cycles. If you reach `(n-1, n-1)`, return its distance. If the queue becomes empty before reaching the target, return -1. Check edge cases like the start or end cell being blocked (value 1).",
          difficulty: "mid",
          slug: "shortest-path-in-binary-matrix",
        },
      ],
    },
    {
      patternName: "Depth-First Search (DFS)",
      totalProblems: 5,
      info: "A graph traversal algorithm that explores as far as possible along each branch before backtracking. Uses recursion or an explicit stack. Suitable for path finding, cycle detection, topological sorting, and problems solvable by exploring all possibilities (like permutations or combinations).",
      problems: [
        {
          title: "Number of Islands",
          type: "coding-pattern",
          description:
            'Given an `m x n` 2D binary grid `grid` which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\nExample 1:\nInput: grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]\nOutput: 1\n\nExample 2:\nInput: grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]\nOutput: 3\n\nConstraints:\nm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j]` is \'0\' or \'1\'.',
          hint: "Iterate through each cell of the grid. If you find a '1' (land) that hasn't been visited yet, increment the island count and start a DFS (or BFS) from that cell. The DFS should mark all connected '1' cells as visited (e.g., by changing them to '0' or using a separate visited matrix) to ensure each island is counted only once.",
          difficulty: "mid",
          slug: "number-of-islands",
        },
        {
          title: "Max Area of Island",
          type: "coding-pattern",
          description:
            "You are given an `m x n` binary matrix `grid`. An island is a group of '1's (representing land) connected 4-directionally (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.\nThe area of an island is the number of cells with a value '1' in the island.\nReturn the maximum area of an island in `grid`. If there is no island, return 0.\n\nExample 1:\nInput: grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]\nOutput: 6\nExplanation: The answer is not 11, because the island must be connected 4-directionally.\n\nExample 2:\nInput: grid = [[0,0,0,0,0,0,0,0]]\nOutput: 0\n\nConstraints:\nm == grid.length\nn == grid[i].length\n1 <= m, n <= 50\ngrid[i][j]` is either 0 or 1.",
          hint: "Similar to 'Number of Islands'. Iterate through the grid. When you find an unvisited '1', start a DFS (or BFS). The DFS function should return the size of the island it just explored. Keep track of the maximum size found across all islands.",
          difficulty: "mid",
          slug: "max-area-of-island",
        },
        {
          title: "Path Sum",
          type: "coding-pattern",
          description:
            "Given the root of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.\nA leaf is a node with no children.\n\nExample 1:\nInput: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22\nOutput: true\nExplanation: The root-to-leaf path 5 -> 4 -> 11 -> 2 sums to 22.\n\nExample 2:\nInput: root = [1,2,3], targetSum = 5\nOutput: false\n\nExample 3:\nInput: root = [1,2], targetSum = 0\nOutput: false\n\nConstraints:\nThe number of nodes in the tree is in the range [0, 5000].\n-1000 <= Node.val <= 1000\n-1000 <= targetSum <= 1000",
          hint: "Use DFS (recursion is natural here). Define a recursive function that takes the current node and the remaining sum needed. The base case is a null node (return false). If the current node is a leaf, check if its value equals the remaining sum. Otherwise, recursively call the function for the left and right children, subtracting the current node's value from the remaining sum.",
          difficulty: "easy",
          slug: "path-sum",
        },
        {
          title: "Symmetric Tree",
          type: "coding-pattern",
          description:
            "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).\n\nExample 1:\nInput: root = [1,2,2,3,4,4,3]\nOutput: true\n\nExample 2:\nInput: root = [1,2,2,null,3,null,3]\nOutput: false\n\nConstraints:\nThe number of nodes in the tree is in the range [1, 1000].\n-100 <= Node.val <= 100",
          hint: "A tree is symmetric if the left subtree is a mirror image of the right subtree. Use a recursive helper function `isMirror(t1, t2)` that checks if two trees `t1` and `t2` are mirrors. The base cases involve null nodes. Recursively check if `t1.left` is a mirror of `t2.right` AND `t1.right` is a mirror of `t2.left`, and ensure `t1.val == t2.val`.",
          difficulty: "easy",
          slug: "symmetric-tree",
        },
        {
          title: "Flood Fill",
          type: "coding-pattern",
          description:
            "An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image.\nYou are also given three integers `sr`, `sc`, and `color`. You should perform a flood fill on the image starting from the pixel `image[sr][sc]`.\nTo perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with `color`.\nReturn the modified image after performing the flood fill.\n\nExample 1:\nInput: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2\nOutput: [[2,2,2],[2,2,0],[2,0,1]]\nExplanation: From the center of the image with position (sr, sc) = (1, 1) (i.e., the value 1), all pixels connected by a path of the same color were changed to 2.\nNote the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.\n\nExample 2:\nInput: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0\nOutput: [[0,0,0],[0,0,0]]\nExplanation: The starting pixel is already colored 0, so no changes are made to the image.\n\nConstraints:\nm == image.length\nn == image[i].length\n1 <= m, n <= 50\n0 <= image[i][j], color < 2^16\n0 <= sr < m\n0 <= sc < n",
          hint: "Use DFS (or BFS). Start the traversal from `(sr, sc)`. Keep track of the initial color of the starting pixel. In the DFS function, first check boundary conditions and if the current pixel's color is the same as the initial color. If it is, change its color to the new `color` and recursively call DFS for its 4-directionally adjacent neighbors. Avoid infinite loops by checking if the current color is already the target color.",
          difficulty: "easy",
          slug: "flood-fill",
        },
      ],
    },
    {
      patternName: "Greedy Approach",
      totalProblems: 4,
      info: "Makes the locally optimal choice at each step with the hope of finding a global optimum. Doesn't always guarantee the optimal solution but is often efficient and works for specific problem structures.",
      problems: [
        {
          title: "Best Time to Buy and Sell Stock",
          type: "coding-pattern",
          description:
            "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n\nConstraints:\n1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
          hint: "Iterate through the prices. Keep track of the minimum price encountered so far (`minPrice`). For each day, calculate the potential profit if you sold on that day (`currentPrice - minPrice`). Update the maximum profit found if the current potential profit is higher. Update `minPrice` if the current price is lower.",
          difficulty: "easy",
          slug: "best-time-to-buy-and-sell-stock",
        },
        {
          title: "Jump Game",
          type: "coding-pattern",
          description:
            "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\nReturn `true` if you can reach the last index, or `false` otherwise.\n\nExample 1:\nInput: nums = [2,3,1,1,4]\nOutput: true\nExplanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.\n\nExample 2:\nInput: nums = [3,2,1,0,4]\nOutput: false\nExplanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.\n\nConstraints:\n1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5",
          hint: "Work backwards from the last index or forwards from the first. A greedy forward approach: keep track of the `maxReachable` index you can currently get to. Iterate through the array. If the current index `i` is greater than `maxReachable`, you cannot proceed further. Otherwise, update `maxReachable = max(maxReachable, i + nums[i])`. If `maxReachable` reaches or exceeds the last index, return true.",
          difficulty: "mid",
          slug: "jump-game",
        },
        {
          title: "Gas Station",
          type: "coding-pattern",
          description:
            "There are `n` gas stations along a circular route, where the amount of gas at the `i`-th station is `gas[i]`.\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i`-th station to its next `(i + 1)`-th station. You begin the journey with an empty tank at one of the gas stations.\nGiven two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.\n\nExample 1:\nInput: gas = [1,2,3,4,5], cost = [3,4,5,1,2]\nOutput: 3\nExplanation:\nStart at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 4. Your tank = 4 - 1 + 5 = 8\nTravel to station 0. Your tank = 8 - 2 + 1 = 7\nTravel to station 1. Your tank = 7 - 3 + 2 = 6\nTravel to station 2. Your tank = 6 - 4 + 3 = 5\nTravel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.\nTherefore, return 3.\n\nExample 2:\nInput: gas = [2,3,4], cost = [3,4,3]\nOutput: -1\nExplanation:\nYou can't start at station 0 or 1, as there is not enough gas to travel to the next station.\nLet's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 0. Your tank = 4 - 3 + 2 = 3\nTravel to station 1. Your tank = 3 - 3 + 3 = 3\nYou cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.\nTherefore, you can't travel around the circuit starting from any station.\n\nConstraints:\nn == gas.length == cost.length\n1 <= n <= 10^5\n0 <= gas[i], cost[i] <= 10^4",
          hint: "First, check if a solution is possible: if the total gas is less than the total cost, return -1. If a solution exists, iterate through the stations. Maintain `currentTank` and `startStation`. If at any point `currentTank` drops below zero while trying to reach station `i+1` from `i`, it means you cannot start from `startStation` (or any station between `startStation` and `i`). Reset `currentTank` to 0 and set the potential new `startStation` to `i+1`.",
          difficulty: "mid",
          slug: "gas-station",
        },
        {
          title: "Merge Intervals",
          type: "coding-pattern",
          description:
            "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nExample 1:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].\n\nExample 2:\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\nExplanation: Intervals [1,4] and [4,5] are considered overlapping.\n\nConstraints:\n1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= starti <= endi <= 10^4",
          hint: "First, sort the intervals based on their start times. Iterate through the sorted intervals. Maintain a list of merged intervals. If the current interval overlaps with the last interval in the merged list (i.e., `current.start <= lastMerged.end`), merge them by updating the end time of the last merged interval (`lastMerged.end = max(lastMerged.end, current.end)`). Otherwise, add the current interval as a new non-overlapping interval.",
          difficulty: "mid",
          slug: "merge-intervals",
        },
      ],
    },
    {
      patternName: "Backtracking",
      totalProblems: 4,
      info: "A general algorithmic technique for solving problems recursively by trying to build a solution incrementally. Explores all potential solutions and abandons ('backtracks' from) paths that don't satisfy constraints or lead to a solution. Often used for permutations, combinations, subsets, and solving puzzles.",
      problems: [
        {
          title: "Subsets",
          type: "coding-pattern",
          description:
            "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\nThe solution set must not contain duplicate subsets. Return the solution in any order.\n\nExample 1:\nInput: nums = [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n\nExample 2:\nInput: nums = [0]\nOutput: [[],[0]]\n\nConstraints:\n1 <= nums.length <= 10\n-10 <= nums[i] <= 10\nAll the numbers of `nums` are unique.",
          hint: "Use a recursive helper function (DFS/backtracking). The function takes the current index `start` and the current subset `currentSubset` being built. In each call, add `currentSubset` to the result list. Then, iterate from `start` to the end of `nums`. For each element `nums[i]`, add it to `currentSubset`, make a recursive call `helper(i + 1, currentSubset)`, and then remove `nums[i]` from `currentSubset` (backtrack).",
          difficulty: "mid",
          slug: "subsets",
        },
        {
          title: "Permutations",
          type: "coding-pattern",
          description:
            "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.\n\nExample 1:\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\nExample 2:\nInput: nums = [0,1]\nOutput: [[0,1],[1,0]]\n\nExample 3:\nInput: nums = [1]\nOutput: [[1]]\n\nConstraints:\n1 <= nums.length <= 6\n-10 <= nums[i] <= 10\nAll the integers of `nums` are unique.",
          hint: "Use a recursive backtracking approach. Maintain a list for the current permutation being built and a way to track used elements (e.g., a boolean array or by swapping elements). The base case for recursion is when the current permutation's size equals `nums.length`. In the recursive step, iterate through `nums`. If an element hasn't been used, add it to the current permutation, mark it as used, make a recursive call, then unmark it and remove it from the permutation (backtrack).",
          difficulty: "mid",
          slug: "permutations",
        },
        {
          title: "Combination Sum",
          type: "coding-pattern",
          description:
            "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.\nThe test cases are generated such that the number of unique combinations that sum up to `target` is less than 150 combinations for the given input.\n\nExample 1:\nInput: candidates = [2,3,6,7], target = 7\nOutput: [[2,2,3],[7]]\nExplanation:\n2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.\n7 is a candidate, and 7 = 7.\nThese are the only two combinations.\n\nExample 2:\nInput: candidates = [2,3,5], target = 8\nOutput: [[2,2,2,2],[2,3,3],[3,5]]\n\nExample 3:\nInput: candidates = [2], target = 1\nOutput: []\n\nConstraints:\n1 <= candidates.length <= 30\n2 <= candidates[i] <= 40\nAll elements of `candidates` are distinct.\n1 <= target <= 40",
          hint: "Use backtracking. Define a recursive function `findCombinations(startIndex, currentSum, currentCombination)`. The base cases: if `currentSum == target`, add `currentCombination` to results; if `currentSum > target`, return. In the recursive step, iterate through candidates starting from `startIndex` (to avoid duplicate combinations like [2,3] and [3,2]). For each candidate, add it to `currentCombination`, recursively call `findCombinations` with the *same* `startIndex` (allowing reuse) and updated `currentSum`, then backtrack by removing the candidate.",
          difficulty: "mid",
          slug: "combination-sum",
        },
        {
          title: "Generate Parentheses",
          type: "coding-pattern",
          description:
            'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\nExample 1:\nInput: n = 3\nOutput: ["((()))","(()())","(())()","()(())","()()()"]\n\nExample 2:\nInput: n = 1\nOutput: ["()"]\n\nConstraints:\n1 <= n <= 8',
          hint: "Use backtracking. Maintain counts of open and closed parentheses used so far. In the recursive function, you can add an open parenthesis '(' if `openCount < n`. You can add a closed parenthesis ')' if `closeCount < openCount` (ensuring validity). The base case is when the length of the generated string is `2 * n`.",
          difficulty: "mid",
          slug: "generate-parentheses",
        },
      ],
    },
    {
      patternName: "Bit Manipulation",
      totalProblems: 3,
      info: "Techniques for manipulating individual bits of numbers using bitwise operators (AND, OR, XOR, NOT, Shifts). Useful for optimization, specific algorithms (like counting set bits), and handling flags or sets efficiently.",
      problems: [
        {
          title: "Single Number",
          type: "coding-pattern",
          description:
            "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\nYou must implement a solution with a linear runtime complexity and use only constant extra space.\n\nExample 1:\nInput: nums = [2,2,1]\nOutput: 1\n\nExample 2:\nInput: nums = [4,1,2,1,2]\nOutput: 4\n\nExample 3:\nInput: nums = [1]\nOutput: 1\n\nConstraints:\n1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element in the array appears twice except for one element which appears only once.",
          hint: "Utilize the XOR operator (`^`). The XOR operation has the property that `x ^ x = 0` and `x ^ 0 = x`. If you XOR all numbers in the array together, the pairs will cancel each other out, leaving only the single number.",
          difficulty: "easy",
          slug: "single-number",
        },
        {
          title: "Number of 1 Bits",
          type: "coding-pattern",
          description:
            "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).\n\nExample 1:\nInput: n = 00000000000000000000000000001011 (11 in decimal)\nOutput: 3\nExplanation: The input binary string 00000000000000000000000000001011 has a total of three '1' bits.\n\nExample 2:\nInput: n = 00000000000000000000000010000000 (128 in decimal)\nOutput: 1\n\nExample 3:\nInput: n = 11111111111111111111111111111101 (-3 in decimal, two's complement)\nOutput: 31\n\nConstraints:\nThe input must be a binary string of length 32.",
          hint: "You can iterate 32 times. In each iteration, check the last bit using the AND operator (`n & 1`). If it's 1, increment a counter. Then, right-shift the number (`n >>= 1`) to process the next bit. Alternatively, use the trick `n &= (n - 1)`, which removes the least significant '1' bit in each step, and count how many steps until `n` becomes 0.",
          difficulty: "easy",
          slug: "number-of-1-bits",
        },
        {
          title: "Counting Bits",
          type: "coding-pattern",
          description:
            "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of '1's in the binary representation of `i`.\n\nExample 1:\nInput: n = 2\nOutput: [0,1,1]\nExplanation:\n0 --> 0\n1 --> 1\n2 --> 10\n\nExample 2:\nInput: n = 5\nOutput: [0,1,1,2,1,2]\nExplanation:\n0 --> 0\n1 --> 1\n2 --> 10\n3 --> 11\n4 --> 100\n5 --> 101\n\nConstraints:\n0 <= n <= 10^5\n\nFollow up: It is very easy to come up with a solution with a runtime of O(n log n). Can you do it in linear time O(n) and possibly in a single pass? Can you do it without using any built-in function for counting bits?",
          hint: "Consider the relationship between the number of set bits for `i` and `i/2` (integer division, or right shift `i >> 1`). If `i` is even, `countBits(i) = countBits(i/2)`. If `i` is odd, `countBits(i) = countBits(i/2) + 1`. You can build the result array iteratively using this relationship (dynamic programming).",
          difficulty: "easy",
          slug: "counting-bits",
        },
      ],
    },
  ],
};
