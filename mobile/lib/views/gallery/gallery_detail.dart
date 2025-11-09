import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class GalleryDetailPage extends StatelessWidget {
  final Map<String, dynamic> post;
  const GalleryDetailPage({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> comments = [
      {'user': 'andi_rpl', 'comment': 'Wih keren banget suasananya! 🔥'},
      {'user': 'nabila23', 'comment': 'Bagus banget fotonyaa 😍'},
      {'user': 'rizkydev', 'comment': 'Ini di lapangan belakang ya?'},
      {'user': 'sarahh', 'comment': 'Aesthetic parah 🤩'},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Detail Komentar"),
        backgroundColor: Colors.white,
        elevation: 0.3,
        foregroundColor: Colors.black,
      ),
      body: Column(
        children: [
          // 🔹 Hero Image
          Hero(
            tag: post['image'],
            child: AspectRatio(
              aspectRatio: 1,
              child: Image.network(
                post['image'],
                fit: BoxFit.cover,
                width: double.infinity,
              ),
            ),
          ),

          // 🔹 Caption
          Padding(
            padding: const EdgeInsets.all(14.0),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(post['profile']),
                  radius: 18,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text.rich(
                    TextSpan(
                      text: "${post['username']} ",
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                      children: [
                        TextSpan(
                          text: post['caption'],
                          style: const TextStyle(
                              fontWeight: FontWeight.w400, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // 🔹 List komentar
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: comments.length,
              itemBuilder: (context, index) {
                final c = comments[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundImage:
                        NetworkImage('https://i.pravatar.cc/150?img=${index + 10}'),
                  ),
                  title: Text.rich(
                    TextSpan(
                      text: '${c['user']} ',
                      style: const TextStyle(fontWeight: FontWeight.w700),
                      children: [
                        TextSpan(
                          text: c['comment'],
                          style: const TextStyle(fontWeight: FontWeight.w400),
                        ),
                      ],
                    ),
                  ),
                  trailing: const Icon(Iconsax.heart, size: 18),
                );
              },
            ),
          ),

          // 🔹 Input komentar bawah
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              border: Border(
                top: BorderSide(color: Colors.grey.shade300),
              ),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=15'),
                  radius: 16,
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Tambahkan komentar...",
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Iconsax.send1, size: 20),
                  onPressed: () {},
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
