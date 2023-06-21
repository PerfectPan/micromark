import assert from 'node:assert/strict'
import test from 'node:test'
import {micromark} from 'micromark'

test('url', function () {
  assert.equal(
    micromark('[](<%>)'),
    '<p><a href="%25"></a></p>',
    'should support incorrect percentage encoded values (1)'
  )

  assert.equal(
    micromark('[](<%%20>)'),
    '<p><a href="%25%20"></a></p>',
    'should support incorrect percentage encoded values (2)'
  )

  assert.equal(
    micromark('[](<%a%20>)'),
    '<p><a href="%25a%20"></a></p>',
    'should support incorrect percentage encoded values (3)'
  )

  assert.equal(
    micromark('[](<foo\uD800bar>)'),
    '<p><a href="foo%EF%BF%BDbar"></a></p>',
    'should support a lone high surrogate (lowest)'
  )

  assert.equal(
    micromark('[](<foo\uDBFFbar>)'),
    '<p><a href="foo%EF%BF%BDbar"></a></p>',
    'should support a lone high surrogate (highest)'
  )

  assert.equal(
    micromark('[](<\uD800bar>)'),
    '<p><a href="%EF%BF%BDbar"></a></p>',
    'should support a lone high surrogate at the start (lowest)'
  )

  assert.equal(
    micromark('[](<\uDBFFbar>)'),
    '<p><a href="%EF%BF%BDbar"></a></p>',
    'should support a lone high surrogate at the start (highest)'
  )

  assert.equal(
    micromark('[](<foo\uD800>)'),
    '<p><a href="foo%EF%BF%BD"></a></p>',
    'should support a lone high surrogate at the end (lowest)'
  )

  assert.equal(
    micromark('[](<foo\uDBFF>)'),
    '<p><a href="foo%EF%BF%BD"></a></p>',
    'should support a lone high surrogate at the end (highest)'
  )

  assert.equal(
    micromark('[](<foo\uDC00bar>)'),
    '<p><a href="foo%EF%BF%BDbar"></a></p>',
    'should support a lone low surrogate (lowest)'
  )

  assert.equal(
    micromark('[](<foo\uDFFFbar>)'),
    '<p><a href="foo%EF%BF%BDbar"></a></p>',
    'should support a lone low surrogate (highest)'
  )

  assert.equal(
    micromark('[](<\uDC00bar>)'),
    '<p><a href="%EF%BF%BDbar"></a></p>',
    'should support a lone low surrogate at the start (lowest)'
  )

  assert.equal(
    micromark('[](<\uDFFFbar>)'),
    '<p><a href="%EF%BF%BDbar"></a></p>',
    'should support a lone low surrogate at the start (highest)'
  )

  assert.equal(
    micromark('[](<foo\uDC00>)'),
    '<p><a href="foo%EF%BF%BD"></a></p>',
    'should support a lone low surrogate at the end (lowest)'
  )

  assert.equal(
    micromark('[](<foo\uDFFF>)'),
    '<p><a href="foo%EF%BF%BD"></a></p>',
    'should support a lone low surrogate at the end (highest)'
  )

  assert.equal(
    micromark('[](<🤔>)'),
    '<p><a href="%F0%9F%A4%94"></a></p>',
    'should support an emoji'
  )

  /** @type {Array<string>} */
  const ascii = []
  let code = -1

  while (++code < 128) {
    // LF and CR can’t be in resources.
    if (code === 10 || code === 13) {
      continue
    }

    // `<`, `>`, `\` need to be escaped.
    if (code === 60 || code === 62 || code === 92) {
      ascii.push('\\')
    }

    ascii.push(String.fromCharCode(code))
  }

  assert.equal(
    micromark('[](<' + ascii.join('') + '>)'),
    '<p><a href="%EF%BF%BD%01%02%03%04%05%06%07%08%09%0B%0C%0E%0F%10%11%12%13%14%15%16%17%18%19%1A%1B%1C%1D%1E%1F%20!%22#$%25&amp;\'()*+,-./0123456789:;%3C=%3E?@ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B%5C%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D~%7F"></a></p>',
    'should support ascii characters'
  )
})
