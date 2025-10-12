import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
}) => {
    return (
        <Dialog open={openModal} onOpenChange={closeModal} className="w-[90%] max-w-lg mx-auto h-auto rounded-lg shadow-lg">
            <DialogContent className="!p-0 !m-0 bg-white rounded-lg overflow-hidden max-h-[90vh]">
                {detailLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Memuat...
                    </div>
                ) : detail ? (
                    <div className="flex flex-col">
                        {/* Image Section */}
                        <div className="bg-gray-200 flex justify-center items-center h-80">
                            <img
                                src={detail.src}
                                alt={detail.title}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="px-6 py-4 flex flex-col">
                            {/* Title and Uploader */}
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-900">{detail.title}</h2>
                                <p className="text-sm text-gray-500">
                                    Diunggah oleh <span className="font-semibold text-gray-700">{detail.uploader}</span>
                                </p>
                            </div>

                            {/* Comments Section */}
                            <ScrollArea className="flex-1 mb-16 pb-16" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {komentarList.length > 0 ? (
                                    komentarList.map((k) => (
                                        <div key={k.id_komentar ?? `${k.id_user}-${k.tanggal_komentar}`} className="mb-4 pb-3 border-b last:border-none">
                                            <p className="text-sm text-gray-800">
                                                <span className="font-semibold">{k.username || "User"}</span> {k.isi_komentar}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(k.tanggal_komentar).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-10">Belum ada komentar.</p>
                                )}
                            </ScrollArea>

                            {/* Like & Share Section */}


                            {/* Comment Form Section with Fixed Position */}
                            <form onSubmit={sendKomentar} className="fixed bottom-0 left-0 right-0 bg-white shadow-md pb-8 px-6 z-10">
                                <div className="bg-white  py-4 px-6 z-10">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Button variant="ghost" size="icon" onClick={toggleLike} className="hover:bg-transparent">
                                                <Heart className={`h-6 w-6 transition-all ${liked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                                            </Button>
                                            <span className="text-sm text-gray-700">{likeCount} suka</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => navigator.share?.({ title: detail.title, url: window.location.href }) || navigator.clipboard?.writeText(window.location.href)}
                                            className="hover:bg-transparent"
                                        >
                                            <Share2 className="h-5 w-5 text-gray-600" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Input
                                        placeholder="Tambahkan komentar..."
                                        value={newKomentar}
                                        onChange={(e) => setNewKomentar(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" className="px-5">Kirim</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        Tidak dapat memuat data.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GalleryDetailModal;