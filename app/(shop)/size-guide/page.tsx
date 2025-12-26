export const metadata = {
    title: 'Size Guide',
    description: 'Find your perfect fit with our comprehensive size guide for men and women.',
}

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Size Guide</h1>
                    <p className="text-soft-gray max-w-2xl mx-auto">
                        Find your perfect fit with our detailed sizing charts and measurement guide
                    </p>
                </div>

                {/* How to Measure */}
                <section className="mb-16 max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl mb-6">How to Measure</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-medium mb-3">Bust/Chest</h3>
                            <p className="text-sm text-soft-gray">
                                Measure around the fullest part of your bust/chest, keeping the tape parallel to the floor.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-3">Waist</h3>
                            <p className="text-sm text-soft-gray">
                                Measure around your natural waistline, keeping the tape comfortably loose.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-3">Hips</h3>
                            <p className="text-sm text-soft-gray">
                                Measure around the fullest part of your hips, approximately 8 inches below your waist.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-3">Inseam</h3>
                            <p className="text-sm text-soft-gray">
                                Measure from the top of your inner thigh to your ankle bone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Women's Sizing */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Women's Sizing</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone/20">
                                <tr>
                                    <th className="px-4 py-3 text-left">Size</th>
                                    <th className="px-4 py-3 text-left">US</th>
                                    <th className="px-4 py-3 text-left">UK</th>
                                    <th className="px-4 py-3 text-left">EU</th>
                                    <th className="px-4 py-3 text-left">Bust (in)</th>
                                    <th className="px-4 py-3 text-left">Waist (in)</th>
                                    <th className="px-4 py-3 text-left">Hips (in)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/10">
                                <tr>
                                    <td className="px-4 py-3 font-medium">XXS</td>
                                    <td className="px-4 py-3">0</td>
                                    <td className="px-4 py-3">4</td>
                                    <td className="px-4 py-3">32</td>
                                    <td className="px-4 py-3">31-32</td>
                                    <td className="px-4 py-3">23-24</td>
                                    <td className="px-4 py-3">33-34</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">XS</td>
                                    <td className="px-4 py-3">2</td> <td className="px-4 py-3">6</td>
                                    <td className="px-4 py-3">34</td>
                                    <td className="px-4 py-3">33-34</td>
                                    <td className="px-4 py-3">25-26</td>
                                    <td className="px-4 py-3">35-36</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">S</td>
                                    <td className="px-4 py-3">4-6</td>
                                    <td className="px-4 py-3">8-10</td>
                                    <td className="px-4 py-3">36-38</td>
                                    <td className="px-4 py-3">35-36</td>
                                    <td className="px-4 py-3">27-28</td>
                                    <td className="px-4 py-3">37-38</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">M</td>
                                    <td className="px-4 py-3">8-10</td>
                                    <td className="px-4 py-3">12-14</td>
                                    <td className="px-4 py-3">40-42</td>
                                    <td className="px-4 py-3">37-39</td>
                                    <td className="px-4 py-3">29-31</td>
                                    <td className="px-4 py-3">39-41</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">L</td>
                                    <td className="px-4 py-3">12-14</td>
                                    <td className="px-4 py-3">16-18</td>
                                    <td className="px-4 py-3">44-46</td>
                                    <td className="px-4 py-3">40-42</td>
                                    <td className="px-4 py-3">32-34</td>
                                    <td className="px-4 py-3">42-44</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">XL</td>
                                    <td className="px-4 py-3">16-18</td>
                                    <td className="px-4 py-3">20-22</td>
                                    <td className="px-4 py-3">48-50</td>
                                    <td className="px-4 py-3">43-45</td>
                                    <td className="px-4 py-3">35-37</td>
                                    <td className="px-4 py-3">45-47</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Men's Sizing */}
                <section className="mb-16">
                    <h2 className="font-serif text-3xl mb-6">Men's Sizing</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone/20">
                                <tr>
                                    <th className="px-4 py-3 text-left">Size</th>
                                    <th className="px-4 py-3 text-left">US</th>
                                    <th className="px-4 py-3 text-left">UK</th>
                                    <th className="px-4 py-3 text-left">EU</th>
                                    <th className="px-4 py-3 text-left">Chest (in)</th>
                                    <th className="px-4 py-3 text-left">Waist (in)</th>
                                    <th className="px-4 py-3 text-left">Neck (in)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/10">
                                <tr>
                                    <td className="px-4 py-3 font-medium">XS</td>
                                    <td className="px-4 py-3">34</td>
                                    <td className="px-4 py-3">34</td>
                                    <td className="px-4 py-3">44</td>
                                    <td className="px-4 py-3">33-35</td>
                                    <td className="px-4 py-3">27-29</td>
                                    <td className="px-4 py-3">14-14.5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">S</td>
                                    <td className="px-4 py-3">36</td>
                                    <td className="px-4 py-3">36</td>
                                    <td className="px-4 py-3">46</td>
                                    <td className="px-4 py-3">35-37</td>
                                    <td className="px-4 py-3">29-31</td>
                                    <td className="px-4 py-3">15-15.5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">M</td>
                                    <td className="px-4 py-3">38-40</td>
                                    <td className="px-4 py-3">38-40</td>
                                    <td className="px-4 py-3">48-50</td>
                                    <td className="px-4 py-3">37-40</td>
                                    <td className="px-4 py-3">31-34</td>
                                    <td className="px-4 py-3">15.5-16</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">L</td>
                                    <td className="px-4 py-3">42-44</td>
                                    <td className="px-4 py-3">42-44</td>
                                    <td className="px-4 py-3">52-54</td>
                                    <td className="px-4 py-3">40-43</td>
                                    <td className="px-4 py-3">34-37</td>
                                    <td className="px-4 py-3">16.5-17</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">XL</td>
                                    <td className="px-4 py-3">46-48</td>
                                    <td className="px-4 py-3">46-48</td>
                                    <td className="px-4 py-3">56-58</td>
                                    <td className="px-4 py-3">43-46</td>
                                    <td className="px-4 py-3">37-40</td>
                                    <td className="px-4 py-3">17-17.5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">XXL</td>
                                    <td className="px-4 py-3">50-52</td>
                                    <td className="px-4 py-3">50-52</td>
                                    <td className="px-4 py-3">60-62</td>
                                    <td className="px-4 py-3">46-49</td>
                                    <td className="px-4 py-3">40-43</td>
                                    <td className="px-4 py-3">18-18.5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Fit Guide */}
                <section className="max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl mb-6">Fit Guide</h2>
                    <div className="space-y-6 bg-stone/20 p-8">
                        <div>
                            <h3 className="font-medium mb-2">Relaxed Fit</h3>
                            <p className="text-sm text-soft-gray">
                                Loose and comfortable with extra room throughout. Perfect for layering.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Regular Fit</h3>
                            <p className="text-sm text-soft-gray">
                                Traditional fit with a comfortable amount of room in the body and sleeves.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Slim Fit</h3>
                            <p className="text-sm text-soft-gray">
                                Tailored silhouette that follows the body's natural lines without being restrictive.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Between Sizes?</h3>
                            <p className="text-sm text-soft-gray">
                                We recommend sizing up for a more relaxed fit or sizing down for a closer fit.
                                Contact our customer service team for personalized recommendations.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
