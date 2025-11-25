import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const GalleryDetailModal = ({
    openModal,
    closeModal,
    detailLoading,
    detail,
    komentarList,
    likeCount,
    liked,
    toggleLike,
    sendKomentar,
    newKomentar,
    setNewKomentar,
    userId,
    onReply,
    onEdit,
    onDelete,
}) => {
    const [mode, setMode] = useState("new");
    const [targetComment, setTargetComment] = useState(null); // { id, username }

    const resetMode = () => {
        setMode("new");
        setTargetComment(null);
        setNewKomentar("");
    };

    const handleDelete = async (commentId) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus komentar ini?");
        if (confirmDelete) {
            try {
                await onDelete(commentId); // Panggil fungsi onDelete dari props
                alert("Komentar berhasil dihapus");
            } catch (err) {
                alert("Gagal menghapus komentar");
                console.error(err);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        if (mode === "new") {
            return sendKomentar(e);
        }

        e.preventDefault();
        if (!newKomentar.trim() || !targetComment) return;

        try {
            if (mode === "reply") {
                await onReply(targetComment.id, newKomentar);
            } else if (mode === "edit") {
                await onEdit(targetComment.id, newKomentar);
            }
            resetMode();
        } catch (err) {
            console.error(err);
        }
    };

    const CommentItem = ({ comment, isChild = false, level = 1 }) => {
        const firstLetter =
            comment.username && comment.username.length > 0
                ? comment.username[0].toUpperCase()
                : "U";

        const isReplyModeHere =
            mode === "reply" && targetComment?.id === comment.id_komentar;
        const isEditModeHere =
            mode === "edit" && targetComment?.id === comment.id_komentar;

        const canReply = level < 2;  // Tidak bisa reply lebih dari level 2

        return (
            <div className={`mb-3 ${isChild ? "ml-8" : ""}`}>
                <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                        {firstLetter}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-900">
                            <span className="font-semibold mr-1">
                                {comment.username || "User"}
                            </span>
                            {comment.isi_komentar}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                            <span>{new Date(comment.tanggal_komentar).toLocaleString()}</span>

                            {userId && canReply && (
                                <button
                                    type="button"
                                    className={`font-medium hover:underline ${isReplyModeHere ? "text-blue-600" : ""}`}
                                    onClick={() => {
                                        if (isReplyModeHere) {
                                            resetMode();
                                        } else {
                                            setMode("reply");
                                            setTargetComment({
                                                id: comment.id_komentar,
                                                username: comment.username || "User",
                                            });
                                            setNewKomentar("");
                                        }
                                    }}
                                >
                                    Balas
                                </button>
                            )}

                            {userId && userId === comment.id_user && (
                                <>
                                    <button
                                        type="button"
                                        className={`font-medium hover:underline ${isEditModeHere ? "text-blue-600" : ""}`}
                                        onClick={() => {
                                            if (isEditModeHere) {
                                                resetMode();
                                            } else {
                                                setMode("edit");
                                                setTargetComment({
                                                    id: comment.id_komentar,
                                                    username: comment.username || "User",
                                                });
                                                setNewKomentar(comment.isi_komentar || "");
                                            }
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="font-medium text-red-500 hover:underline"
                                        onClick={() => handleDelete(comment.id_komentar)}
                                    >
                                        Hapus
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {comment.replies.map((reply, index) => {
                            if (index < 4) {
                                return (
                                    <CommentItem
                                        key={reply.id_komentar}
                                        comment={reply}
                                        isChild={true}
                                        level={level + 1}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={openModal} onOpenChange={closeModal}>
            <DialogContent
                className="w-full max-w-5xl sm:max-w-5xl min-h-0 h-[90vh] p-0 border-none overflow-hidden bg-white flex flex-col"
            >
                {detailLoading ? (
                    <div className="flex h-full w-full items-center justify-center text-gray-500">
                        Memuat...
                    </div>
                ) : detail ? (
                    <div className="flex h-full flex-col md:flex-row bg-white">
                        {/* LEFT: gambar besar ala Instagram */}
                        <div className="relative flex-1 md:min-w-[480px] bg-black flex items-center justify-center overflow-hidden">
                            {detail.src ? (
                                <img
                                    src={detail.src}
                                    alt={detail.title}
                                    className="w-full h-[350px] sm:h-[400px] object-cover"
                                />
                            ) : (
                                <div className="text-sm text-gray-400">Tidak ada gambar</div>
                            )}
                        </div>

                        {/* RIGHT: panel komentar */}
                        <div className="w-full md:w-[420px] flex flex-col border-l bg-white min-h-0 flex-grow">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                                        {detail.uploader && detail.uploader.length > 0
                                            ? detail.uploader[0].toUpperCase()
                                            : "U"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{detail.uploader || "Uploader"}</span>
                                        {detail.title && <span className="text-xs text-gray-500">{detail.title}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Scroll area: caption + komentar */}
                            <ScrollArea
                                className="flex-1 min-h-0 overflow-y-auto px-4 py-3"
                                style={{ maxHeight: "calc(90vh - 160px)" }}
                            >
                                {komentarList && komentarList.length > 0 ? (
                                    komentarList.map((k) => (
                                        <CommentItem key={k.id_komentar ?? `${k.id_user}-${k.tanggal_komentar}`} comment={k} />
                                    ))
                                ) : (
                                    <p className="mt-10 text-center text-sm text-gray-400">Belum ada komentar.</p>
                                )}
                            </ScrollArea>

                            {/* Footer: like, share, form komentar */}
                            <div className="border-t px-4 pt-2 pb-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" type="button" onClick={toggleLike} className="hover:bg-transparent">
                                            <Heart
                                                className={`h-6 w-6 transition-all ${liked ? "fill-red-500 text-red-500" : "text-gray-600"
                                                    }`}
                                            />
                                        </Button>
                                        <span className="text-sm text-gray-900">{likeCount} suka</span>
                                    </div>

                                    <Button variant="ghost" size="icon" type="button" className="hover:bg-transparent" onClick={async () => {
                                        try {
                                            if (navigator.share) {
                                                await navigator.share({
                                                    title: detail.title,
                                                    url: window.location.href,
                                                });
                                            } else if (navigator.clipboard) {
                                                await navigator.clipboard.writeText(window.location.href);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}>
                                        <Share2 className="h-5 w-5 text-gray-600" />
                                    </Button>
                                </div>

                                {/* Label mode edit / reply */}
                                {mode !== "new" && targetComment && (
                                    <div className="flex items-center justify-between text-[11px] text-gray-600">
                                        <div>
                                            {mode === "reply" ? (
                                                <>
                                                    Membalas <span className="font-semibold">@{targetComment.username}</span>
                                                </>
                                            ) : (
                                                <>Mengedit komentar</>
                                            )}
                                        </div>
                                        <button type="button" onClick={resetMode} className="font-medium hover:underline">
                                            Batal
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                                    <Input
                                        placeholder={mode === "reply" ? `Balas @${targetComment?.username || ""}...` : "Tambahkan komentar..."}
                                        value={newKomentar}
                                        onChange={(e) => setNewKomentar(e.target.value)}
                                        className="flex-1 text-sm h-9"
                                    />
                                    <Button type="submit" size="sm" className="px-4">
                                        {mode === "edit" ? "Simpan" : mode === "reply" ? "Balas" : "Kirim"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600">
                        Tidak dapat memuat data.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GalleryDetailModal;
