'use client';

import { useState } from 'react';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ParagraphNode, TextNode } from 'lexical';

import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { BlockFormatDropDown } from '@/components/editor/plugins/toolbar/block-format-toolbar-plugin';
import { FormatBulletedList } from '@/components/editor/plugins/toolbar/block-format/format-bulleted-list';
import { FormatCheckList } from '@/components/editor/plugins/toolbar/block-format/format-check-list';
import { FormatHeading } from '@/components/editor/plugins/toolbar/block-format/format-heading';
import { FormatNumberedList } from '@/components/editor/plugins/toolbar/block-format/format-numbered-list';
import { FormatParagraph } from '@/components/editor/plugins/toolbar/block-format/format-paragraph';
import { FormatQuote } from '@/components/editor/plugins/toolbar/block-format/format-quote';
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin';
import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClearFormattingToolbarPlugin } from './plugins/toolbar/clear-formatting-toolbar-plugin';
import { ElementFormatToolbarPlugin } from './plugins/toolbar/element-format-toolbar-plugin';
import { FontColorToolbarPlugin } from './plugins/toolbar/font-color-toolbar-plugin';
import { FontBackgroundToolbarPlugin } from './plugins/toolbar/font-background-toolbar-plugin';
import { FontFormatToolbarPlugin } from './plugins/toolbar/font-format-toolbar-plugin';
import { Separator } from '@radix-ui/react-menu';
import { LinkToolbarPlugin } from './plugins/toolbar/link-toolbar-plugin';
import { ImagesPlugin } from './plugins/images-plugin';

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

export function HtmlEditor() {
  return (
    <div className='bg-background w-full overflow-hidden rounded-lg border'>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <Plugins />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

const placeholder = 'Start typing...';

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className='relative'>
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className='vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1'>
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={['h1', 'h2', 'h3']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
            <Separator className='border-1 border-neutral-200' />
            <FontFormatToolbarPlugin format='bold' />
            <FontFormatToolbarPlugin format='strikethrough' />
            <FontFormatToolbarPlugin format='italic' />
            <Separator />
            <ElementFormatToolbarPlugin />
            <FontColorToolbarPlugin />
            <FontBackgroundToolbarPlugin />
            <LinkToolbarPlugin />
            {/* <ImagesPlugin /> */}
          </div>
        )}
      </ToolbarPlugin>

      <div className='relative'>
        <RichTextPlugin
          contentEditable={
            <div className=''>
              <div className='' ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className='ContentEditable__root relative block h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none'
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <CheckListPlugin />
        {/* rest of the plugins */}
      </div>
    </div>
  );
}
