import { useState } from "react"
import {
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin"
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { ListMaxIndentLevelPlugin } from "@/components/editor/plugins/list-max-indent-level-plugin"
import { TabFocusPlugin } from "@/components/editor/plugins/tab-focus-plugin"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { TypingPerfPlugin } from "@/components/editor/plugins/typing-pref-plugin"
import { Separator } from "@workspace/ui/components/separator"

const placeholder = "Start writing..."

export function LitePlugins({ }) {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null)
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem)
        }
    }

    return (
        <div className="relative">
            <ToolbarPlugin>
                {({ blockType }) => (
                    <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                        <HistoryToolbarPlugin />
                        <Separator orientation="vertical" className="!h-7" />
                        <BlockFormatDropDown>
                            <FormatParagraph />
                            <FormatHeading levels={["h1", "h2", "h3"]} />
                            <FormatNumberedList />
                            <FormatBulletedList />
                            <FormatQuote />
                        </BlockFormatDropDown>
                        <Separator orientation="vertical" className="!h-7" />
                        <FontFormatToolbarPlugin />
                        <Separator orientation="vertical" className="!h-7" />
                        <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                    </div>
                )}
            </ToolbarPlugin>
            <div className="relative">
                <AutoFocusPlugin />
                <RichTextPlugin
                    contentEditable={
                        <div className="">
                            <div className="" ref={onRef}>
                                <ContentEditable
                                    placeholder={placeholder}
                                    className="ContentEditable__root relative block h-[calc(100vh-90px)] min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                                />
                            </div>
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <ClickableLinkPlugin />
                <CheckListPlugin />
                <HorizontalRulePlugin />
                <ListPlugin />
                <TabIndentationPlugin />
                <HistoryPlugin />
                <CodeHighlightPlugin />

                <MarkdownShortcutPlugin
                    transformers={[
                        CHECK_LIST,
                        ...ELEMENT_TRANSFORMERS,
                        ...MULTILINE_ELEMENT_TRANSFORMERS,
                        ...TEXT_FORMAT_TRANSFORMERS,
                        ...TEXT_MATCH_TRANSFORMERS,
                    ]}
                />
                <TypingPerfPlugin />
                <TabFocusPlugin />
                <AutoLinkPlugin />

                <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                />

                <ListMaxIndentLevelPlugin />
            </div>
        </div>
    )
}
